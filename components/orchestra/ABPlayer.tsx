'use client';

import { useEffect, useRef, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { actionSx, toggleSx, SEEK_ACCENT } from './ui';
import PieceToggle from './PieceToggle';
import { audioSrc, type Piece } from './piece';

type Side = 'A' | 'B';

const TRACKS: Record<Side, { label: string; sub: string; file: string }> = {
  A: { label: 'A — 伝統配置', sub: 'アメリカ式', file: 'US_VR.m4a' },
  B: { label: 'B — パレート解', sub: '最適化で得た配置', file: 'V5_KNEE.m4a' },
};

function fmt(sec: number): string {
  if (!Number.isFinite(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function ABPlayer() {
  const aRef = useRef<HTMLAudioElement>(null);
  const bRef = useRef<HTMLAudioElement>(null);
  const [active, setActive] = useState<Side>('A');
  const [playing, setPlaying] = useState(false);
  const [cur, setCur] = useState(0);
  const [dur, setDur] = useState(0);
  const [piece, setPiece] = useState<Piece>('mozart');

  // Switching the source piece reloads both <audio> elements; reset transport.
  useEffect(() => {
    aRef.current?.pause();
    bRef.current?.pause();
    setPlaying(false);
    setCur(0);
  }, [piece]);

  const elOf = (s: Side) => (s === 'A' ? aRef.current : bRef.current);

  const handlePlayPause = () => {
    const el = elOf(active);
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      void el.play();
      setPlaying(true);
    }
  };

  const switchTo = (target: Side) => {
    if (target === active) return;
    const from = elOf(active);
    const to = elOf(target);
    if (from && to) {
      to.currentTime = from.currentTime;
      setCur(to.currentTime);
      if (Number.isFinite(to.duration)) setDur(to.duration);
      if (playing) {
        from.pause();
        void to.play();
      }
    }
    setActive(target);
  };

  const handleSeek = (v: number) => {
    setCur(v);
    if (aRef.current) aRef.current.currentTime = v;
    if (bRef.current) bRef.current.currentTime = v;
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
      {(['A', 'B'] as Side[]).map((s) => (
        <audio
          key={s}
          ref={s === 'A' ? aRef : bRef}
          src={audioSrc(piece, TRACKS[s].file)}
          preload="metadata"
          onLoadedMetadata={(e) => {
            if (s === active) setDur(e.currentTarget.duration);
          }}
          onTimeUpdate={(e) => {
            if (s === active) setCur(e.currentTarget.currentTime);
          }}
          onEnded={() => {
            if (s === active) setPlaying(false);
          }}
        >
          <track kind="captions" />
        </audio>
      ))}

      <Box sx={{ mb: 2 }}>
        <PieceToggle value={piece} onChange={setPiece} />
      </Box>

      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        {(['A', 'B'] as Side[]).map((s) => {
          const on = s === active;
          return (
            <Button
              key={s}
              onClick={() => switchTo(s)}
              sx={{ ...toggleSx(on), flex: 1, flexDirection: 'column', py: 1 }}
            >
              <Box component="span" sx={{ fontWeight: 700 }}>
                {TRACKS[s].label}
                {on && playing ? ' ● 再生中' : ''}
              </Box>
              <Box component="span" sx={{ fontSize: '0.72rem', opacity: 0.85 }}>
                {TRACKS[s].sub}
              </Box>
            </Button>
          );
        })}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          onClick={handlePlayPause}
          sx={{ ...actionSx, minWidth: 44, px: 1.5 }}
          aria-label={playing ? '停止' : '再生'}
        >
          {playing ? '⏸' : '▶'}
        </Button>
        <Typography variant="caption" color="text.secondary" sx={{ fontVariantNumeric: 'tabular-nums', minWidth: 40 }}>
          {fmt(cur)}
        </Typography>
        <input
          type="range"
          min={0}
          max={dur || 0}
          step="any"
          value={Math.min(cur, dur || 0)}
          onChange={(e) => handleSeek(Number(e.target.value))}
          style={{ flex: 1, accentColor: SEEK_ACCENT }}
          aria-label="再生位置 (A/B 共有)"
        />
        <Typography variant="caption" color="text.secondary" sx={{ fontVariantNumeric: 'tabular-nums', minWidth: 40 }}>
          {fmt(dur)}
        </Typography>
      </Box>

      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1.5 }}>
        🎧 ヘッドホン必須。A/B は音量を揃えてあり、切り替えても再生位置は同じ時刻を保ちます。
        実際のブラインド確認では左右をランダム化し、どちらが最適解かを伏せて比較しました。
      </Typography>
    </Box>
  );
}
