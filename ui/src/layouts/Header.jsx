import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import logo from '../assets/sbs360 logo.png';
import {
  AppBar, Toolbar, IconButton, Menu,
  MenuItem, Tooltip, Avatar, InputBase, Box, Divider
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';

// Icons
import SegmentIcon from '@mui/icons-material/Segment';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';

import { toggleTheme } from '../redux/slices/themeSlice';
import { logoutSuccess } from '../redux/slices/authSlice';
import API from '../services/api';

export default function Header({ open, onMenuClick, setToast }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);

  // Local menus state
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleLogout = async () => {
    try {
      await API.post('/auth/logout');
    } catch (err) {
      // Continue client logout regardless of backend failure
    }
    dispatch(logoutSuccess());
    navigate('/login');
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider',
        backdropFilter: 'blur(8px)',
        backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.8),
      }}
    >
      <Toolbar sx={{ minHeight: 64, display: 'flex', alignItems: 'center', px: { xs: 1.5, sm: 3 } }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={onMenuClick}
          edge="start"
          sx={{
            mr: 2,
            color: 'text.secondary',
            '&:hover': {
              color: 'primary.main',
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08)
            }
          }}
        >
          {open ? <MenuOpenIcon /> : <SegmentIcon />}
        </IconButton>

        {/* Logo and Brand Name */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mr: 2 }}>
          <Box
            component="img"
            src={logo}
            alt="SBS 360 Logo"
            title='SBS 360'
            sx={{
              height: { xs: 28, sm: 60 },
              width: 'auto',
              maxHeight: 100,
              objectFit: 'contain',
              transition: 'transform 0.2s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              }
            }}
          />
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Theme Toggle */}
          <Tooltip title="Toggle light/dark theme">
            <IconButton
              color="inherit"
              onClick={() => dispatch(toggleTheme())}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08)
                }
              }}
            >
              {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Tooltip>

          {/* User Profile Avatar */}
          <Tooltip title="Account settings">
            <IconButton
              onClick={handleOpenUserMenu}
              sx={{
                p: 0.5,
                ml: 1,
                border: '2px solid',
                borderColor: 'transparent',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: 'primary.light'
                }
              }}
            >
              <Avatar
                sx={{
                  bgcolor: 'secondary.main',
                  width: 32,
                  height: 32,
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                }}
              >
                {user?.first_name ? user.first_name[0].toUpperCase() : 'U'}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>

      {/* User Profile Menu */}
      <Menu
        anchorEl={anchorElUser}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
        PaperProps={{ sx: { width: 180, mt: 1.5, borderRadius: 3 } }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/profile'); }}>
          <ListItemIcon sx={{ mr: 1, minWidth: 'auto', display: 'flex', alignItems: 'center' }}><PersonIcon fontSize="small" /></ListItemIcon>
          My Profile
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
          <ListItemIcon sx={{ mr: 1, minWidth: 'auto', display: 'flex', alignItems: 'center' }}><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
          Log Out
        </MenuItem>
      </Menu>
    </AppBar>
  );
}

// Minimal placeholder ListItemIcon
const ListItemIcon = ({ children, sx }) => (
  <Box sx={{ display: 'inline-flex', mr: 1.5, color: 'action.active', ...sx }}>
    {children}
  </Box>
);
