import { createTheme, type Theme } from '@mui/material/styles';

export type ThemeMode = 'light' | 'dark';

// A single accent used consistently across the app for primary actions,
// active nav, focus rings, and the "total jobs" highlight. Semantic status
// colours (used by StatusChip) intentionally stay separate — they carry
// meaning and must not be repainted with the accent.
const ACCENT = {
  dark: '#38BDF8', // cyan-leaning blue, on dark surfaces
  light: '#0284C7', // deeper for contrast on light surfaces
};

const FONT_STACK =
  '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

function palette(mode: ThemeMode) {
  if (mode === 'dark') {
    return {
      mode: 'dark' as const,
      primary: { main: ACCENT.dark, contrastText: '#001018' },
      secondary: { main: '#22D3EE' },
      background: {
        default: '#0B1220', // deep slate, high contrast
        paper: '#111A2E',
      },
      text: {
        primary: '#E6EDF7',
        secondary: '#98A6BD',
        disabled: '#5B6779',
      },
      divider: 'rgba(148, 163, 184, 0.14)',
      action: {
        hover: 'rgba(56, 189, 248, 0.08)',
        selected: 'rgba(56, 189, 248, 0.16)',
        focus: 'rgba(56, 189, 248, 0.24)',
      },
    };
  }
  return {
    mode: 'light' as const,
    primary: { main: ACCENT.light, contrastText: '#ffffff' },
    secondary: { main: '#0891B2' },
    background: {
      default: '#F6F8FB',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0F172A',
      secondary: '#4B5563',
      disabled: '#94A3B8',
    },
    divider: 'rgba(15, 23, 42, 0.10)',
    action: {
      hover: 'rgba(2, 132, 199, 0.06)',
      selected: 'rgba(2, 132, 199, 0.12)',
      focus: 'rgba(2, 132, 199, 0.18)',
    },
  };
}

export function getTheme(mode: ThemeMode): Theme {
  const isDark = mode === 'dark';
  const pal = palette(mode);
  const appBarBg = isDark ? '#0A101E' : '#0F172A';
  const headBg = isDark ? '#0E1728' : '#F1F5F9';
  const headFg = isDark ? '#98A6BD' : '#475569';

  return createTheme({
    palette: pal,
    shape: { borderRadius: 10 },
    typography: {
      fontFamily: FONT_STACK,
      h4: { fontWeight: 600, letterSpacing: -0.5, fontSize: '1.75rem' },
      h5: { fontWeight: 600, letterSpacing: -0.3, fontSize: '1.375rem' },
      h6: { fontWeight: 600, letterSpacing: -0.2, fontSize: '1.125rem' },
      subtitle2: {
        fontWeight: 600,
        letterSpacing: 0.2,
        fontSize: '0.8125rem',
      },
      overline: {
        fontWeight: 700,
        letterSpacing: 1.2,
        fontSize: '0.6875rem',
      },
      body2: { fontSize: '0.875rem', lineHeight: 1.55 },
      button: { textTransform: 'none', fontWeight: 600, letterSpacing: 0.1 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: pal.background.default,
            color: pal.text.primary,
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
          },
        },
      },
      MuiAppBar: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            backgroundColor: appBarBg,
            backgroundImage: 'none',
            borderBottom: `1px solid ${
              isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.08)'
            }`,
            color: '#F8FAFC',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: 'none' },
          outlined: {
            borderColor: pal.divider,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            border: `1px solid ${pal.divider}`,
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottomColor: pal.divider,
            padding: '12px 16px',
            fontSize: '0.875rem',
          },
          head: {
            fontWeight: 700,
            fontSize: '0.6875rem',
            letterSpacing: 1,
            textTransform: 'uppercase',
            color: headFg,
            backgroundColor: headBg,
            borderBottom: `1px solid ${pal.divider}`,
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            '&:hover': {
              backgroundColor: isDark
                ? 'rgba(56, 189, 248, 0.06)'
                : 'rgba(2, 132, 199, 0.05)',
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            fontWeight: 600,
            letterSpacing: 0.2,
          },
          outlined: {
            borderColor: pal.divider,
          },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            borderRadius: 8,
            paddingInline: 14,
          },
          containedPrimary: {
            boxShadow: 'none',
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiTextField: {
        defaultProps: { size: 'small' },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#FFFFFF',
          },
          notchedOutline: {
            borderColor: pal.divider,
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 12,
            backgroundImage: 'none',
            border: `1px solid ${pal.divider}`,
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: { borderColor: pal.divider },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            fontSize: '0.75rem',
            backgroundColor: isDark ? '#1E293B' : '#0F172A',
          },
        },
      },
    },
  });
}

// Backwards-compat export in case anything still imports { theme }.
export const theme = getTheme('dark');
