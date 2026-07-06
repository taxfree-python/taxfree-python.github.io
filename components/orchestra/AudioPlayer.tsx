'use client';

import { useEffect, useRef, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { actionSx, SEEK_ACCENT } from './ui';

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

  // Reset when the source changes (e.g. switching layouts).
  useEffect(() => {
    setPlaying(false);
    setCur(0);
  }, [src]);

  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      void el.play();
      setPlaying(true);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <audio
        ref={ref}
        src={src}
        preload="none"
        onLoadedMetadata={(e) => setDur(e.currentTarget.duration)}
        onTimeUpdate={(e) => setCur(e.currentTarget.currentTime)}
        onEnded={() => setPlaying(false)}
      >
        <track kind="captions" />
      </audio>
      <Button onClick={toggle} sx={{ ...actionSx, minWidth: 44, px: 1.5 }} aria-label={playing ? '一時停止' : '再生'}>
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
  );
}
