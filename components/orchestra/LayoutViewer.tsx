'use client';

import { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import OrchestraStage from './OrchestraStage';
import FamilyLegend from './FamilyLegend';
import AudioPlayer from './AudioPlayer';
import PieceToggle from './PieceToggle';
import { toggleSx } from './ui';
import { audioSrc, type Piece } from './piece';
import type { Layout } from './types';
import layoutsData from './data/layouts.json';

const LAYOUTS = (layoutsData as { layouts: Layout[] }).layouts;

/** Short chip labels; the full label + descriptor live in the detail panel. */
const SHORT: Record<string, string> = {
  us: 'US式',
  german: 'ドイツ式',
  v3winner: 'パレート解-1',
  v2spread: 'パレート解-2',
  stack: 'STACK',
  ring: 'RING',
};

export default function LayoutViewer() {
  const [selectedId, setSelectedId] = useState(LAYOUTS[0]!.id);
  const [piece, setPiece] = useState<Piece>('mozart');
  const current = LAYOUTS.find((l) => l.id === selectedId) ?? LAYOUTS[0]!;

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
          display: 'flex',
          flexWrap: 'nowrap',
          gap: 1,
          mb: 2,
          overflowX: 'auto',
          pb: 0.5,
          '::-webkit-scrollbar': { height: 6 },
        }}
      >
        {LAYOUTS.map((l) => (
          <Button
            key={l.id}
            size="small"
            onClick={() => setSelectedId(l.id)}
            sx={{ ...toggleSx(l.id === selectedId), flex: '0 0 auto' }}
          >
            {SHORT[l.id] ?? l.label}
          </Button>
        ))}
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'minmax(0, 1fr) minmax(0, 1fr)' },
          gap: 3,
          alignItems: 'center',
        }}
      >
        <Box sx={{ maxWidth: 380, mx: 'auto', width: '100%', color: 'text.primary' }}>
          <OrchestraStage positions={current.positions} />
        </Box>

        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
            {current.label}
            <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
              {current.mode === 'surround' ? 'サラウンド' : 'ステージ'}
            </Typography>
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: '3.2em' }}>
            {current.description}
          </Typography>
          <AudioPlayer src={audioSrc(piece, current.audio)} />
          <Box sx={{ mt: 1.5 }}>
            <PieceToggle value={piece} onChange={setPiece} />
          </Box>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
            🎧 ヘッドホン推奨(バイノーラル音源)
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mt: 2 }}>
        <FamilyLegend />
      </Box>
    </Box>
  );
}
