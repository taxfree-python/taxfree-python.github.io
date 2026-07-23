'use client';

import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import type { HeroSubtitle } from '@/types';
import { fontFamilyMono } from '@/lib/theme';

const HOLD_MS = 1800;
const DELETE_MS = 60;
const SWAP_DELETE_MS = 85;
const TYPE_MS = 80;
const WIPE_PAUSE_MS = 400;
const SWAP_PAUSE_MS = 200;

type DynamicSubtitleProps = HeroSubtitle;

type CycleStep = readonly [number, number];

function buildCycle(xLen: number, yLen: number): CycleStep[] {
  const cycle: CycleStep[] = [];
  for (let i = 0; i < xLen; i++) {
    for (let j = 0; j < yLen; j++) cycle.push([i, j]);
  }
  return cycle;
}

function getCycleStep(cycle: readonly CycleStep[], index: number): CycleStep {
  const step = cycle[index];
  if (step === undefined) {
    throw new Error(`Dynamic subtitle cycle index out of range: ${index}`);
  }
  return step;
}

function getOption(options: readonly [string, ...string[]], index: number): string {
  const option = options[index];
  if (option === undefined) {
    throw new Error(`Dynamic subtitle option index out of range: ${index}`);
  }
  return option;
}

function compose(x: string, connector: string, y: string): string {
  return `${x} ${connector} ${y}`;
}

export function DynamicSubtitle({ xOptions, yOptions, connector }: DynamicSubtitleProps) {
  const [text, setText] = useState(() => compose(xOptions[0], connector, yOptions[0]));

  useEffect(() => {
    const cycle = buildCycle(xOptions.length, yOptions.length);
    if (cycle.length <= 1) return;

    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timeoutId = setTimeout(resolve, ms);
      });

    const loop = async () => {
      let i = 0;
      const [firstXi, firstYi] = getCycleStep(cycle, 0);
      let current = compose(
        getOption(xOptions, firstXi),
        connector,
        getOption(yOptions, firstYi),
      );
      setText(current);

      while (!cancelled) {
        await wait(HOLD_MS);
        if (cancelled) return;

        const next = (i + 1) % cycle.length;
        const [cxi] = getCycleStep(cycle, i);
        const [nxi, nyi] = getCycleStep(cycle, next);
        const target = compose(getOption(xOptions, nxi), connector, getOption(yOptions, nyi));
        const keepPrefix = nxi === cxi ? `${getOption(xOptions, cxi)} ${connector} ` : '';

        const deleteMs = keepPrefix.length === 0 ? DELETE_MS : SWAP_DELETE_MS;
        while (current.length > keepPrefix.length) {
          current = current.slice(0, -1);
          setText(current);
          await wait(deleteMs);
          if (cancelled) return;
        }

        await wait(keepPrefix.length === 0 ? WIPE_PAUSE_MS : SWAP_PAUSE_MS);
        if (cancelled) return;

        while (current.length < target.length) {
          current = target.slice(0, current.length + 1);
          setText(current);
          await wait(TYPE_MS);
          if (cancelled) return;
        }

        i = next;
      }
    };

    void loop();

    return () => {
      cancelled = true;
      if (timeoutId !== null) clearTimeout(timeoutId);
    };
  }, [xOptions, yOptions, connector]);

  return (
    <Typography
      variant="h5"
      component="p"
      sx={{
        color: 'text.secondary',
        mb: 3,
        fontWeight: 500,
        minHeight: '1.6em',
        fontFamily: fontFamilyMono,
      }}
    >
      <Box component="span" sx={{ whiteSpace: 'pre', color: 'text.primary' }}>
        {text}
      </Box>
      <Box
        component="span"
        aria-hidden="true"
        sx={{
          display: 'inline-block',
          width: '0.08em',
          height: '1em',
          ml: '0.08em',
          verticalAlign: '-0.12em',
          backgroundColor: 'currentColor',
          animation: 'dynamic-subtitle-blink 1s steps(1, end) infinite',
          '@keyframes dynamic-subtitle-blink': {
            '0%, 50%': { opacity: 1 },
            '50.01%, 100%': { opacity: 0 },
          },
        }}
      />
    </Typography>
  );
}
