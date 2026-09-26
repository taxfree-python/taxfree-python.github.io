import { Box, Button, Typography } from '@mui/material';
import { toggleSx } from './ui';
import { PIECES, PIECE_LABEL, type Piece } from './piece';

type Props = {
  value: Piece;
  onChange: (p: Piece) => void;
};

/** Small "音源: [Mozart] [Beethoven]" switcher shared by the audio widgets. */
export default function PieceToggle({ value, onChange }: Props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
      <Typography variant="caption" color="text.secondary">
        音源
      </Typography>
      {PIECES.map((p) => (
        <Button key={p} size="small" onClick={() => onChange(p)} sx={{ ...toggleSx(p === value) }}>
          {PIECE_LABEL[p]}
        </Button>
      ))}
    </Box>
  );
}
