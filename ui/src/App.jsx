import React from 'react';
import { useSelector } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { getTheme } from './themes/theme';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  const { mode } = useSelector((state) => state.theme);
  const theme = getTheme(mode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppRoutes />
    </ThemeProvider>
  );
}
