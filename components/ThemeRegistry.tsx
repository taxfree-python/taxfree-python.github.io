'use client';

import * as React from 'react';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { useServerInsertedHTML } from 'next/navigation';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from '@/lib/theme';

export function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const [{ cache, flush }] = React.useState(() => {
    const cache = createCache({ key: 'mui', prepend: true });
    cache.compat = true;

    const prevInsert = cache.insert;
    let inserted: string[] = [];

    cache.insert = (...args: Parameters<typeof cache.insert>) => {
      const [, serialized] = args;
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name);
      }
      return prevInsert(...args);
    };

    const flush = () => {
      const prevInserted = inserted;
      inserted = [];

      if (prevInserted.length === 0) {
        return null;
      }

      const styles = prevInserted
        .map((name) => cache.inserted[name])
        .filter((style): style is string => typeof style === 'string')
        .join('');
      const ids = prevInserted.join(' ');
      const key = prevInserted.join('-');

      if (!styles || !ids) {
        return null;
      }

      return (
        <style
          data-emotion={`${cache.key} ${ids}`}
          key={`${cache.key}-${key}`}
          dangerouslySetInnerHTML={{ __html: styles }}
        />
      );
    };

    return { cache, flush };
  });

  useServerInsertedHTML(() => flush());

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
