import type { SxProps, Theme } from '@mui/material';
import { neutral } from '@/lib/tokens';

/** Neutral accent for native range inputs: the site's secondary text grey. */
export const SEEK_ACCENT = neutral.muted;

const baseButton: SxProps<Theme> = {
  textTransform: 'none',
  borderRadius: 2,
  boxShadow: 'none',
  border: '1px solid',
};

/** Single/A-B selector button. Selected = filled (light), the conventional "on" look. */
export function toggleSx(selected: boolean): SxProps<Theme> {
  return selected
    ? {
        ...baseButton,
        bgcolor: 'text.primary',
        color: 'background.default',
        borderColor: 'text.primary',
        '&:hover': { bgcolor: 'text.primary', opacity: 0.88, boxShadow: 'none' },
      }
    : {
        ...baseButton,
        bgcolor: 'transparent',
        color: 'text.secondary',
        borderColor: 'divider',
        '&:hover': { borderColor: 'text.secondary', bgcolor: 'action.hover' },
      };
}

/** Momentary action button (play / pause): simple, dark, bordered. */
export const actionSx: SxProps<Theme> = {
  ...baseButton,
  bgcolor: 'transparent',
  color: 'text.primary',
  borderColor: 'divider',
  '&:hover': { borderColor: 'text.primary', bgcolor: 'action.hover' },
};
