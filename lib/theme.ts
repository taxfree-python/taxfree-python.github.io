'use client';

import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#e0e0e0',
      light: '#f5f5f5',
      dark: '#c2c2c2',
    },
    secondary: {
      main: '#9e9e9e',
      light: '#bdbdbd',
      dark: '#7a7a7a',
    },
    background: {
      default: '#0d0d0d',
      paper: '#171717',
    },
    text: {
      primary: '#f2f2f2',
      secondary: '#a8a8a8',
    },
    divider: '#2a2a2a',
    grey: {
      50: '#f5f5f5',
      100: '#e0e0e0',
      200: '#cfcfcf',
      300: '#b0b0b0',
      400: '#9e9e9e',
      500: '#7a7a7a',
      600: '#545454',
      700: '#3a3a3a',
      800: '#262626',
      900: '#141414',
    },
    action: {
      active: '#d6d6d6',
      hover: 'rgba(255, 255, 255, 0.08)',
      selected: 'rgba(255, 255, 255, 0.16)',
      disabled: 'rgba(255, 255, 255, 0.3)',
      disabledBackground: 'rgba(255, 255, 255, 0.08)',
      focus: 'rgba(255, 255, 255, 0.2)',
    },
  },
  typography: {
    fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
    h1: {
      fontSize: '2.25rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '1.875rem',
      fontWeight: 700,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
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
          backgroundColor: 'rgba(23, 23, 23, 0.3)',
          backdropFilter: 'blur(10px)',
          transition: 'border-color 0.2s ease, background-color 0.2s ease',
          boxShadow: 'none',
          '&:hover': {
            borderColor: '#333333',
            backgroundColor: 'rgba(23, 23, 23, 0.5)',
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
          backgroundColor: 'rgba(229, 229, 229, 0.14)',
          color: '#f2f2f2',
        },
        colorSecondary: {
          backgroundColor: 'rgba(158, 158, 158, 0.18)',
          color: '#f2f2f2',
        },
        outlined: {
          borderColor: '#333333',
          color: '#d6d6d6',
          '&:hover': {
            borderColor: '#4a4a4a',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
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
          backgroundColor: '#111111',
          color: '#f2f2f2',
          '&:hover': {
            backgroundColor: '#1f1f1f',
          },
        },
        outlinedPrimary: {
          borderColor: '#a8a8a8',
          color: '#f2f2f2',
          '&:hover': {
            borderColor: '#f2f2f2',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
          },
        },
        textPrimary: {
          color: '#f2f2f2',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          },
        },
      },
    },
  },
});
