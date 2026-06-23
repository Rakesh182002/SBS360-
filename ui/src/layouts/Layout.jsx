import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, CssBaseline, useTheme, useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';

// Modular Sub-components
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

import { ToastNotification } from '../components/ReusableComponents';

const drawerWidth = 260;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
    [theme.breakpoints.up('md')]: {
      marginLeft: open ? 0 : `-${drawerWidth}px`,
    },
    bgcolor: theme.palette.background.default,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column'
  }),
);

export default function DashboardLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useSelector((state) => state.auth);

  // States
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* 1. Header (App Bar) */}
      <Header 
        open={sidebarOpen}
        onMenuClick={handleDrawerToggle}
        setToast={setToast}
      />

      {/* 2. Sidebar (Navigation Drawer) */}
      <Sidebar 
        open={sidebarOpen}
        mobileOpen={mobileOpen}
        onDrawerToggle={handleDrawerToggle}
        isMobile={isMobile}
      />

      {/* 3. Main Outlet Container */}
      <Main open={sidebarOpen}>
        {/* Spacer to prevent content overlapping with the floating glass header */}
        <Box sx={{ height: { xs: 80, md: 55 } }} />
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Outlet />
        </Box>
        {/* 4. Footer */}
        {/* <Footer /> */}
      </Main>

      <ToastNotification 
        open={toast.open} 
        message={toast.message} 
        severity={toast.severity} 
        onClose={() => setToast({ ...toast, open: false })} 
      />
    </Box>
  );
}
