'use client';

import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { HeroSubtitle } from '@/types/profile';

interface DynamicSubtitleProps {
  content: HeroSubtitle;
  holdMs?: number;
  deleteMs?: number;
  typeMs?: number;
}

function buildCycle(xLen: number, yLen: number): Array<[number, number]> {
  const cycle: Array<[number, number]> = [];
  for (let i = 0; i < xLen; i++) {
    for (let j = 0; j < yLen; j++) cycle.push([i, j]);
  }
  return cycle;
}

function compose(x: string, connector: string, y: string) {
  return `${x} ${connector} ${y}`;
}

export function DynamicSubtitle({
  content,
  holdMs = 1800,
  deleteMs = 60,
  typeMs = 80,
}: DynamicSubtitleProps) {
  const { xOptions, yOptions, connector } = content;
  const initial = compose(xOptions[0] ?? '', connector, yOptions[0] ?? '');
  const [text, setText] = useState(initial);

  useEffect(() => {
    if (xOptions.length === 0 || yOptions.length === 0) return;

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
      let current = compose(xOptions[cycle[0][0]], connector, yOptions[cycle[0][1]]);
      setText(current);

      while (!cancelled) {
        await wait(holdMs);
        if (cancelled) return;

        const next = (i + 1) % cycle.length;
        const [cxi] = cycle[i];
        const [nxi, nyi] = cycle[next];
        const target = compose(xOptions[nxi], connector, yOptions[nyi]);

        const keepPrefix = nxi === cxi ? `${xOptions[cxi]} ${connector} ` : '';

        while (current.length > keepPrefix.length) {
          if (cancelled) return;
          current = current.slice(0, -1);
          setText(current);
          await wait(deleteMs);
        }

        while (current.length < target.length) {
          if (cancelled) return;
          current = target.slice(0, current.length + 1);
          setText(current);
          await wait(typeMs);
        }

        i = next;
      }
    };

    loop();

    return () => {
      cancelled = true;
      if (timeoutId !== null) clearTimeout(timeoutId);
    };
  }, [xOptions, yOptions, connector, holdMs, deleteMs, typeMs]);

  return (
    <Typography
      variant="h5"
      component="p"
      sx={{
        color: 'text.secondary',
        mb: 3,
        fontWeight: 500,
        letterSpacing: '-0.01em',
        minHeight: '1.6em',
        fontFamily:
          '"JetBrains Mono", "Fira Code", ui-monospace, SFMono-Regular, Menlo, monospace',
      }}
      aria-label={`${xOptions.join(', ')} ${connector} ${yOptions.join(', ')}`}
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
