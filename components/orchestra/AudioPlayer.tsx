'use client';

import { useEffect, useRef, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { actionSx, SEEK_ACCENT } from './ui';

const LOAD_ERROR_MESSAGE = '音声ファイルを読み込めませんでした。';
const PLAY_ERROR_MESSAGE = '音声を再生できませんでした。ページを再読み込みしてからもう一度試してください。';

function fmt(sec: number): string {
  if (!Number.isFinite(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

type Props = {
  src: string;
};

/** Minimal dark audio control: play/pause + shared seekbar + time. */
export default function AudioPlayer({ src }: Props) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [cur, setCur] = useState(0);
  const [dur, setDur] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Reset when the source changes (e.g. switching layouts).
  useEffect(() => {
    ref.current?.pause();
    setPlaying(false);
    setCur(0);
    setDur(0);
    setError(null);
  }, [src]);

  const toggle = async () => {
    const el = ref.current;
    if (!el || error) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      try {
        await el.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
        setError(PLAY_ERROR_MESSAGE);
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <audio
          ref={ref}
          src={src}
          preload="metadata"
          onLoadedMetadata={(e) => {
            setError(null);
            setDur(e.currentTarget.duration);
          }}
          onTimeUpdate={(e) => setCur(e.currentTarget.currentTime)}
          onEnded={() => setPlaying(false)}
          onError={() => {
            ref.current?.pause();
            setPlaying(false);
            setError(LOAD_ERROR_MESSAGE);
          }}
        >
          <track kind="captions" />
        </audio>
        <Button
          onClick={() => void toggle()}
          disabled={error !== null}
          sx={{ ...actionSx, minWidth: 44, px: 1.5 }}
          aria-label={playing ? '一時停止' : '再生'}
        >
          {playing ? '⏸' : '▶'}
        </Button>
        <Typography variant="caption" color="text.secondary" sx={{ fontVariantNumeric: 'tabular-nums', minWidth: 34 }}>
          {fmt(cur)}
        </Typography>
        <input
          type="range"
          min={0}
          max={dur || 0}
          step="any"
          value={Math.min(cur, dur || 0)}
          disabled={error !== null || dur <= 0}
          onChange={(e) => {
            const v = Number(e.target.value);
            setCur(v);
            if (ref.current) ref.current.currentTime = v;
          }}
          style={{ flex: 1, accentColor: SEEK_ACCENT }}
          aria-label="再生位置"
        />
        <Typography variant="caption" color="text.secondary" sx={{ fontVariantNumeric: 'tabular-nums', minWidth: 34 }}>
          {fmt(dur)}
        </Typography>
      </Box>
      {error && (
        <Typography variant="caption" display="block" sx={{ mt: 0.75, color: 'error.main' }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}
