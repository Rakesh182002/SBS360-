import { createTheme } from '@mui/material/styles';

// Mode configurations (Light & Dark)
export const getTheme = (mode) => {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'light' ? '#6366f1' : '#818cf8', // Indigo base
        light: mode === 'light' ? '#818cf8' : '#a5b4fc',
        dark: mode === 'light' ? '#4f46e5' : '#6366f1',
        contrastText: '#ffffff',
      },
      secondary: {
        main: mode === 'light' ? '#ec4899' : '#f472b6', // Pink base
        light: mode === 'light' ? '#f472b6' : '#fbcfe8',
        dark: mode === 'light' ? '#db2777' : '#ec4899',
      },
      background: {
        default: mode === 'light' ? '#f8fafc' : '#0f172a', // Slate colors
        paper: mode === 'light' ? '#ffffff' : '#1e293b',
      },
      text: {
        primary: mode === 'light' ? '#0f172a' : '#f8fafc',
        secondary: mode === 'light' ? '#475569' : '#cbd5e1',
      },
      divider: mode === 'light' ? '#e2e8f0' : '#334155',
    },
    typography: {
      fontFamily: '"Outfit", "Inter", "Helvetica Neue", Arial, sans-serif',
      h1: { fontWeight: 800, fontSize: '2.25rem' },
      h2: { fontWeight: 700, fontSize: '1.875rem' },
      h3: { fontWeight: 700, fontSize: '1.5rem' },
      h4: { fontWeight: 600, fontSize: '1.25rem' },
      h5: { fontWeight: 600, fontSize: '1rem' },
      h6: { fontWeight: 600, fontSize: '0.875rem' },
      body1: { fontSize: '1rem', lineHeight: 1.5 },
      body2: { fontSize: '0.875rem', lineHeight: 1.43 },
      button: {
        textTransform: 'none',
        fontWeight: 600,
        fontSize: '0.875rem',
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: `
          body {
            font-family: "Outfit"!important;
           }
          input, button, select, textarea {
            font-family: "Outfit"!important;
          }
        `,
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: '8px 16px',
            transition: 'all 0.2s ease-in-out',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0px 4px 12px rgba(99, 102, 241, 0.15)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: mode === 'light' 
              ? '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)'
              : '0 4px 6px -1px rgb(0 0 0 / 0.2), 0 2px 4px -2px rgb(0 0 0 / 0.2)',
            border: `1px solid ${mode === 'light' ? '#f1f5f9' : '#334155'}`,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
            borderBottom: `1px solid ${mode === 'light' ? '#e2e8f0' : '#334155'}`,
            background: mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(30, 41, 59, 0.8)',
            backdropFilter: 'blur(8px)',
            color: mode === 'light' ? '#0f172a' : '#f8fafc',
          },
        },
      },
    },
  });
};
