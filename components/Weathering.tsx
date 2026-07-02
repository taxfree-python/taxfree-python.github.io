'use client';

import { useEffect, useRef, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';

import { computeGradientField } from '@/lib/cv/edges';
import { MemoryEngine } from '@/lib/gl/memoryEngine';

/** One simulation step every 45 seconds: the erosion completes at 24:00 JST. */
const STEPS_PER_DAY = 1920;

const MAX_DIMENSION = 1024;
const CATCH_UP_PER_FRAME = 96;
const IDLE_POLL_MS = 500;
const MINUTES_PER_DAY = 1440;

type WeatheringProps = {
  image: string;
};

type Status = 'loading' | 'running' | 'fallback';

function jstMinutesNow(): number {
  return ((Date.now() + 9 * 60 * 60 * 1000) % 86_400_000) / 60_000;
}

function stepForMinutes(minutes: number): number {
  return Math.floor((minutes / MINUTES_PER_DAY) * STEPS_PER_DAY);
}

/**
 * The piece is strictly synchronized to the JST clock — visitors cannot seek.
 * `?preview=HH:MM` pins it to a fixed time, for tuning the piece only.
 */
function previewMinutes(): number | null {
  const raw = new URLSearchParams(window.location.search).get('preview');
  if (!raw) {
    return null;
  }
  const match = /^(\d{1,2}):(\d{2})$/.exec(raw);
  if (!match) {
    return null;
  }
  const minutes = Number(match[1] ?? 0) * 60 + Number(match[2] ?? 0);
  return Math.min(MINUTES_PER_DAY - 1, Math.max(0, minutes));
}

export function Weathering({ image }: WeatheringProps) {
  const glCanvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<MemoryEngine | null>(null);
  const schedulerRef = useRef<{ kind: 'raf' | 'timeout'; id: number } | null>(null);
  const reducedMotionRef = useRef(false);

  const [status, setStatus] = useState<Status>('loading');
  const [aspectRatio, setAspectRatio] = useState('2 / 1');

  useEffect(() => {
    let cancelled = false;

    const cancelScheduled = () => {
      const scheduled = schedulerRef.current;
      if (!scheduled) {
        return;
      }
      if (scheduled.kind === 'raf') {
        cancelAnimationFrame(scheduled.id);
      } else {
        clearTimeout(scheduled.id);
      }
      schedulerRef.current = null;
    };

    const pinned = previewMinutes();

    const tick = () => {
      schedulerRef.current = null;
      const engine = engineRef.current;
      if (cancelled || !engine) {
        return;
      }
      const target = stepForMinutes(pinned ?? jstMinutesNow());
      let mutated = false;
      if (target < engine.stepIndex) {
        engine.reset();
        mutated = true;
      }
      const pending = target - engine.stepIndex;
      if (pending > 0) {
        engine.advance(Math.min(pending, CATCH_UP_PER_FRAME));
        mutated = true;
      }
      if (mutated) {
        const caughtUp = engine.stepIndex >= target;
        if (!reducedMotionRef.current || caughtUp) {
          engine.render();
        }
      }
      if (target - engine.stepIndex > 0) {
        schedulerRef.current = { kind: 'raf', id: requestAnimationFrame(tick) };
      } else {
        schedulerRef.current = {
          kind: 'timeout',
          id: window.setTimeout(tick, IDLE_POLL_MS),
        };
      }
    };

    const setup = (img: HTMLImageElement) => {
      const glCanvas = glCanvasRef.current;
      if (!glCanvas) {
        return;
      }

      const scale = Math.min(1, MAX_DIMENSION / Math.max(img.naturalWidth, img.naturalHeight));
      const width = Math.max(1, Math.round(img.naturalWidth * scale));
      const height = Math.max(1, Math.round(img.naturalHeight * scale));
      const offscreen = document.createElement('canvas');
      offscreen.width = width;
      offscreen.height = height;
      const offscreenContext = offscreen.getContext('2d');
      if (!offscreenContext) {
        setStatus('fallback');
        return;
      }
      offscreenContext.drawImage(img, 0, 0, width, height);
      const pixels = offscreenContext.getImageData(0, 0, width, height);

      const field = computeGradientField({ data: pixels.data, width, height });
      const engine = MemoryEngine.create({
        canvas: glCanvas,
        source: offscreen,
        fieldTexture: field.texture,
        width,
        height,
        totalSteps: STEPS_PER_DAY,
      });
      if (!engine) {
        setStatus('fallback');
        return;
      }
      engineRef.current = engine;
      reducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      setAspectRatio(`${width} / ${height}`);
      setStatus('running');
      tick();
    };

    const img = new Image();
    img.src = image;
    img
      .decode()
      .then(() => {
        if (!cancelled) {
          setup(img);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setStatus('fallback');
        }
      });

    return () => {
      cancelled = true;
      cancelScheduled();
      engineRef.current?.dispose();
      engineRef.current = null;
    };
  }, [image]);

  return (
    <Box sx={{ position: 'relative', width: '100%', aspectRatio, bgcolor: 'action.hover' }}>
      {status === 'fallback' ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt="風化(元画像)"
          style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
        />
      ) : (
        <>
          <canvas ref={glCanvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
          {status === 'loading' && (
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CircularProgress size={28} />
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
