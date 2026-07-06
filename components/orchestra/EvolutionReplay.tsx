'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import OrchestraStage, { boundsOf } from './OrchestraStage';
import FamilyLegend from './FamilyLegend';
import { actionSx, SEEK_ACCENT } from './ui';
import type { EvolutionFrame, Positions } from './types';
import evolutionData from './data/evolution.json';

const FRAMES = evolutionData as EvolutionFrame[];
const MAX = FRAMES.length - 1;
const SPEED = 2; // keyframes per second

const framePos = (f: EvolutionFrame): Positions => f.pos ?? f.positions ?? {};

function lerpPositions(a: Positions, b: Positions, k: number): Positions {
  const out: Positions = {};
  for (const code of Object.keys(a)) {
    const pa = a[code]!;
    const pb = b[code] ?? pa;
    out[code] = { az: pa.az + (pb.az - pa.az) * k, r: pa.r + (pb.r - pa.r) * k };
  }
  return out;
}

const OBJECTIVES = [
  { idx: 0, label: '透明度', dir: '↑', better: 'up' as const },
  { idx: 1, label: 'バランス偏差 dB', dir: '↓', better: 'down' as const },
  { idx: 2, label: '広がり (1−IACC)', dir: '↑', better: 'up' as const },
];

export default function EvolutionReplay() {
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const tRef = useRef(0);
  tRef.current = t;

  const bounds = useMemo(() => boundsOf(FRAMES.map(framePos)), []);
  const range = useMemo(() => {
    const mins = [Infinity, Infinity, Infinity];
    const maxs = [-Infinity, -Infinity, -Infinity];
    for (const f of FRAMES) {
      for (let i = 0; i < 3; i++) {
        mins[i] = Math.min(mins[i]!, f.values[i]!);
        maxs[i] = Math.max(maxs[i]!, f.values[i]!);
      }
    }
    return { mins, maxs };
  }, []);

  useEffect(() => {
    if (!playing) return undefined;
    let raf = 0;
    let last = 0;
    let started = false;
    const loop = (ts: number) => {
      if (!started) {
        last = ts;
        started = true;
        raf = requestAnimationFrame(loop);
        return;
      }
      const dt = (ts - last) / 1000;
      last = ts;
      let next = tRef.current + dt * SPEED;
      if (next >= MAX) {
        next = MAX;
        tRef.current = next;
        setT(next);
        setPlaying(false);
        return;
      }
      tRef.current = next;
      setT(next);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const lo = Math.floor(t);
  const hi = Math.min(lo + 1, MAX);
  const frac = t - lo;
  const frameLo = FRAMES[lo]!;
  const frameHi = FRAMES[hi]!;
  const positions = lerpPositions(framePos(frameLo), framePos(frameHi), frac);
  const trial = Math.round(frameLo.n + (frameHi.n - frameLo.n) * frac);
  const values = [0, 1, 2].map((i) => frameLo.values[i]! + (frameHi.values[i]! - frameLo.values[i]!) * frac);

  const togglePlay = () => {
    if (t >= MAX) {
      setT(0);
      tRef.current = 0;
    }
    setPlaying((p) => !p);
  };

  return (
    <Box
      sx={{
        my: 4,
        p: { xs: 2, sm: 3 },
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'action.hover',
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'minmax(0, 1fr) minmax(0, 1fr)' },
          gap: 3,
          alignItems: 'center',
        }}
      >
        <Box sx={{ maxWidth: 360, mx: 'auto', width: '100%', color: 'text.primary' }}>
          <OrchestraStage positions={positions} bounds={bounds} />
        </Box>

        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            試行 #{trial}
            <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
              暫定ベスト {lo + 1} / {MAX + 1} 個目
            </Typography>
          </Typography>

          <Box sx={{ my: 2 }}>
            {OBJECTIVES.map((o) => {
              const v = values[o.idx]!;
              const min = range.mins[o.idx]!;
              const max = range.maxs[o.idx]!;
              const norm = max > min ? (v - min) / (max - min) : 0;
              const fill = o.better === 'up' ? norm : 1 - norm;
              return (
                <Box key={o.idx} sx={{ mb: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.25 }}>
                    <Typography variant="caption" color="text.secondary">
                      {o.label} {o.dir}
                    </Typography>
                    <Typography variant="caption" color="text.primary" sx={{ fontVariantNumeric: 'tabular-nums' }}>
                      {v.toFixed(3)}
                    </Typography>
                  </Box>
                  <Box sx={{ height: 6, borderRadius: 3, bgcolor: 'divider', overflow: 'hidden' }}>
                    <Box
                      sx={{
                        height: '100%',
                        width: `${Math.round(fill * 100)}%`,
                        bgcolor: 'text.primary',
                        transition: 'width 0.05s linear',
                      }}
                    />
                  </Box>
                </Box>
              );
            })}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button size="small" onClick={togglePlay} sx={{ ...actionSx, minWidth: 104 }}>
              {playing ? '⏸ 一時停止' : t >= MAX ? '↻ 最初から' : '▶ 再生'}
            </Button>
            <input
              type="range"
              min={0}
              max={MAX}
              step="any"
              value={t}
              onChange={(e) => {
                setPlaying(false);
                const v = Number(e.target.value);
                setT(v);
                tRef.current = v;
              }}
              style={{ flex: 1, accentColor: SEEK_ACCENT }}
              aria-label="最適化の進行度"
            />
          </Box>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
            アメリカ式(#0)から、暫定ベストが試行を追って変形していく様子。
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mt: 2 }}>
        <FamilyLegend />
      </Box>
    </Box>
  );
}
