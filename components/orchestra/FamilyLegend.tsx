import { Box, Typography } from '@mui/material';
import { FAMILY_COLOR, type Family } from './instruments';

const ITEMS: { family: Family; label: string }[] = [
  { family: 'strings', label: 'Strings' },
  { family: 'woodwinds', label: 'Woodwinds' },
  { family: 'brass', label: 'Brass' },
  { family: 'percussion', label: 'Percussion' },
];

export default function FamilyLegend() {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'center' }}>
      {ITEMS.map((it) => (
        <Box key={it.family} sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
          <Box
            component="span"
            sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: FAMILY_COLOR[it.family] }}
          />
          <Typography variant="caption" color="text.secondary">
            {it.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
