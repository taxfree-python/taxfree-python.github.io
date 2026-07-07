'use client';

import { useEffect, useRef, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { actionSx, toggleSx, SEEK_ACCENT } from './ui';
import PieceToggle from './PieceToggle';
import { audioSrc, type Piece } from './piece';

const SIDES = ['A', 'B'] as const;
type Side = (typeof SIDES)[number];

const LOAD_ERROR_MESSAGE = '音声ファイルを読み込めませんでした。';
const PLAY_ERROR_MESSAGE = '音声を再生できませんでした。ページを再読み込みしてからもう一度試してください。';

const TRACKS: Record<Side, { label: string; sub: string; file: string }> = {
  A: { label: 'A — 伝統配置', sub: 'アメリカ式', file: 'US_VR.m4a' },
  B: { label: 'B — パレート解', sub: '最適化で得た配置', file: 'V5_KNEE.m4a' },
};

function initialLoadErrors(): Record<Side, string | null> {
  return { A: null, B: null };
}

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
  const [loadErrors, setLoadErrors] = useState<Record<Side, string | null>>(initialLoadErrors);
  const activeError = loadErrors[active];

  // Switching the source piece reloads both <audio> elements; reset transport.
  useEffect(() => {
    aRef.current?.pause();
    bRef.current?.pause();
    setPlaying(false);
    setCur(0);
    setDur(0);
    setLoadErrors(initialLoadErrors());
  }, [piece]);

  const elOf = (s: Side) => (s === 'A' ? aRef.current : bRef.current);

  const setTrackError = (side: Side, message: string) => {
    elOf(side)?.pause();
    if (side === active) setPlaying(false);
    setLoadErrors((prev) => ({ ...prev, [side]: message }));
  };

  const handlePlayPause = async () => {
    const el = elOf(active);
    if (!el || activeError) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      try {
        await el.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
        setTrackError(active, PLAY_ERROR_MESSAGE);
      }
    }
  };

  const switchTo = async (target: Side) => {
    if (target === active || loadErrors[target]) return;
    const from = elOf(active);
    const to = elOf(target);
    if (from && to) {
      to.currentTime = from.currentTime;
      setCur(to.currentTime);
      if (Number.isFinite(to.duration)) setDur(to.duration);
      if (playing) {
        from.pause();
        try {
          await to.play();
        } catch {
          setPlaying(false);
          setTrackError(target, PLAY_ERROR_MESSAGE);
        }
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
      {SIDES.map((s) => (
        <audio
          key={s}
          ref={s === 'A' ? aRef : bRef}
          src={audioSrc(piece, TRACKS[s].file)}
          preload="metadata"
          onLoadedMetadata={(e) => {
            setLoadErrors((prev) => ({ ...prev, [s]: null }));
            if (s === active) setDur(e.currentTarget.duration);
          }}
          onTimeUpdate={(e) => {
            if (s === active) setCur(e.currentTarget.currentTime);
          }}
          onEnded={() => {
            if (s === active) setPlaying(false);
          }}
          onError={() => setTrackError(s, LOAD_ERROR_MESSAGE)}
        >
          <track kind="captions" />
        </audio>
      ))}

      <Box sx={{ mb: 2 }}>
        <PieceToggle value={piece} onChange={setPiece} />
      </Box>

      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        {SIDES.map((s) => {
          const on = s === active;
          const failed = loadErrors[s] !== null;
          return (
            <Button
              key={s}
              onClick={() => void switchTo(s)}
              disabled={failed}
              sx={{ ...toggleSx(on), flex: 1, flexDirection: 'column', py: 1 }}
            >
              <Box component="span" sx={{ fontWeight: 700 }}>
                {TRACKS[s].label}
                {failed ? ' ● 読み込み失敗' : on && playing ? ' ● 再生中' : ''}
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
          onClick={() => void handlePlayPause()}
          disabled={activeError !== null}
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
          disabled={activeError !== null || dur <= 0}
          onChange={(e) => handleSeek(Number(e.target.value))}
          style={{ flex: 1, accentColor: SEEK_ACCENT }}
          aria-label="再生位置 (A/B 共有)"
        />
        <Typography variant="caption" color="text.secondary" sx={{ fontVariantNumeric: 'tabular-nums', minWidth: 40 }}>
          {fmt(dur)}
        </Typography>
      </Box>

      {activeError && (
        <Typography variant="caption" display="block" sx={{ mt: 0.75, color: 'error.main' }}>
          {TRACKS[active].label}: {activeError}
        </Typography>
      )}

      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1.5 }}>
        🎧 ヘッドホン必須。A/B は音量を揃えてあり、切り替えても再生位置は同じ時刻を保ちます。
        実際のブラインド確認では左右をランダム化し、どちらが最適解かを伏せて比較しました。
      </Typography>
    </Box>
  );
}
