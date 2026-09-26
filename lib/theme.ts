'use client';

import { createTheme } from '@mui/material/styles';
import { grey, neutral } from './tokens';

export const fontFamilyMono = 'var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, monospace';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: neutral.ink,
      light: neutral.inkLight,
      dark: neutral.inkDark,
    },
    secondary: {
      main: neutral.accent,
      light: neutral.accentLight,
      dark: neutral.faint,
    },
    background: {
      default: neutral.bg,
      paper: neutral.surface,
    },
    text: {
      primary: neutral.text,
      secondary: neutral.muted,
    },
    divider: neutral.line,
    grey: { ...grey },
    action: {
      active: neutral.active,
      hover: neutral.overlayHover,
      selected: neutral.overlaySelected,
      disabled: neutral.overlayDisabled,
      disabledBackground: neutral.overlayHover,
      focus: neutral.overlayFocus,
    },
  },
  typography: {
    fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
    allVariants: {
      letterSpacing: '-0.01em',
    },
    h1: {
      fontWeight: 700,
      fontSize: '2rem',
      '@media (min-width:900px)': { fontSize: '2.5rem' },
    },
    h2: {
      fontSize: '1.875rem',
      fontWeight: 700,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    subtitle1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      fontWeight: 500,
    },
    subtitle2: {
      fontSize: '1rem',
      lineHeight: 1.6,
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: '1px solid transparent',
          backgroundColor: neutral.surfaceGlass,
          backdropFilter: 'blur(10px)',
          transition: 'border-color 0.2s ease, background-color 0.2s ease',
          boxShadow: 'none',
          '&:hover': {
            borderColor: neutral.border,
            backgroundColor: neutral.surfaceGlassHover,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 6,
        },
        colorPrimary: {
          backgroundColor: neutral.chipPrimaryBg,
          color: neutral.text,
        },
        colorSecondary: {
          backgroundColor: neutral.chipSecondaryBg,
          color: neutral.text,
        },
        outlined: {
          borderColor: neutral.border,
          color: neutral.active,
          '&:hover': {
            borderColor: neutral.borderHover,
            backgroundColor: neutral.overlaySubtle,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 6,
          transition: 'all 0.2s ease',
        },
        containedPrimary: {
          backgroundColor: neutral.buttonBg,
          color: neutral.text,
          '&:hover': {
            backgroundColor: neutral.buttonBgHover,
          },
        },
        outlinedPrimary: {
          borderColor: neutral.muted,
          color: neutral.text,
          '&:hover': {
            borderColor: neutral.text,
            backgroundColor: neutral.overlayHover,
          },
        },
        textPrimary: {
          color: neutral.text,
          '&:hover': {
            backgroundColor: neutral.overlaySubtle,
          },
        },
      },
    },
  },
});
