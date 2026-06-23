import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import logo from '../assets/sbs360 logo.png';
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon,
  ListItemText, Divider, Avatar, Typography, Toolbar, IconButton, Collapse
} from '@mui/material';

// Icons
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SecurityIcon from '@mui/icons-material/Security';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import PersonIcon from '@mui/icons-material/Person';

import { logoutSuccess } from '../redux/slices/authSlice';
import API from '../services/api';

const drawerWidth = 260;

export default function Sidebar({ open, mobileOpen, onDrawerToggle, isMobile }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  // Track submenus open states
  const [openMenus, setOpenMenus] = useState({
    admin: false,
    config: false
  });

  const [loginTime, setLoginTime] = useState('');

  useEffect(() => {
    let time = sessionStorage.getItem('loginTime');
    if (!time) {
      time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      sessionStorage.setItem('loginTime', time);
    }
    setLoginTime(time);
  }, []);

  useEffect(() => {
    // Determine which submenu is active based on the current pathname
    const adminPaths = ['/users', '/roles'];
    const configPaths = ['/settings', '/profile'];

    if (adminPaths.includes(location.pathname)) {
      setOpenMenus({ admin: true, config: false });
    } else if (configPaths.includes(location.pathname)) {
      setOpenMenus({ admin: false, config: true });
    } else if (location.pathname === '/') {
      setOpenMenus({ admin: false, config: false });
    }
  }, [location.pathname]);

  const handleToggleMenu = (menuKey) => {
    setOpenMenus((prev) => {
      const isOpen = prev[menuKey];
      const nextState = {};

      // Close all other menus
      Object.keys(prev).forEach((key) => {
        nextState[key] = false;
      });

      // Toggle the target menu
      nextState[menuKey] = !isOpen;
      return nextState;
    });
  };

  const handleLogout = async () => {
    try {
      await API.post('/auth/logout');
    } catch (err) {
      // Proceed on client anyway
    }
    dispatch(logoutSuccess());
    navigate('/login');
  };

  // Define structured menus and submenus
  const menuStructure = [
    {
      label: 'Dashboard',
      type: 'item',
      path: '/Dashboard',
      icon: <DashboardIcon />,
      permission: 'read:dashboard'
    },
    {
      label: 'ERP Master',
      type: 'submenu',
      key: 'admin',
      icon: <PeopleIcon />,
      items: [
        { label: 'Employee', path: '/employee', permission: 'read:users' },
        { label: 'Client', path: '/client', permission: 'read:users' },
        { label: 'Product', path: '/product', permission: 'read:users' },
        { label: 'Supplier', path: '/supplier', permission: 'read:users' },
        { label: 'Vehicle', path: '/vehicle', permission: 'read:users' }
      ]
    }
  ];

  // Helper to filter submenus & items based on permissions
  const filterMenuItems = (structure) => {
    return structure.filter(item => {
      const isSuperAdmin = user?.role === 'Super Admin';

      if (item.type === 'item') {
        if (isSuperAdmin) return true;
        return !item.permission || user?.permissions?.includes(item.permission);
      }

      if (item.type === 'submenu') {
        // Filter child elements
        const visibleChildren = item.items.filter(child => {
          if (isSuperAdmin) return true;
          return !child.permission || user?.permissions?.includes(child.permission);
        });

        // Add visible children back to parent, and keep submenu only if it has children
        item.visibleChildren = visibleChildren;
        return visibleChildren.length > 0;
      }
      return false;
    });
  };

  const filteredStructure = filterMenuItems(menuStructure);

  const sidebarContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: 'background.paper', overflow: 'hidden' }}>

      {/* Mobile Brand Header */}
      {isMobile && (
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.25,
          px: 2.5,
          py: 2.25,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'action.hover'
        }}>
          <Box
            component="img"
            src={logo}
            alt="SBS 360 Logo"
            sx={{
              height: 28,
              width: 'auto',
              objectFit: 'contain'
            }}
          />
          <Typography variant="subtitle1" sx={{ fontWeight: 800, letterSpacing: '-0.5px', color: 'text.primary' }}>
            SBS 360
          </Typography>
        </Box>
      )}

      {/* Navigation List */}
      <Box sx={{
        flexGrow: 1,
        px: 1.5,
        py: 2,
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(100, 116, 139, 0.2)',
          borderRadius: '3px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: 'rgba(100, 116, 139, 0.4)',
        },
      }}>
        <List>
          {filteredStructure.map((item) => {
            if (item.type === 'item') {
              const isActive = location.pathname === item.path;
              return (
                <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    onClick={() => {
                      navigate(item.path);
                      setOpenMenus((prev) => {
                        const nextState = {};
                        Object.keys(prev).forEach((key) => {
                          nextState[key] = false;
                        });
                        return nextState;
                      });
                      if (isMobile) onDrawerToggle();
                    }}
                    sx={{
                      borderRadius: 2.5,
                      bgcolor: isActive ? 'primary.main' : 'transparent',
                      color: isActive ? '#fff' : 'text.primary',
                      '&:hover': {
                        bgcolor: isActive ? 'primary.main' : 'action.hover',
                      }
                    }}
                  >
                    <ListItemIcon sx={{ color: isActive ? '#fff' : 'text.secondary', minWidth: 40 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: isActive ? 600 : 500 }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            }

            if (item.type === 'submenu') {
              const isMenuOpen = openMenus[item.key];
              // Submenu parent is active if one of its children is active
              const hasActiveChild = item.visibleChildren.some(child => location.pathname === child.path);

              return (
                <React.Fragment key={item.label}>
                  <ListItem disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                      onClick={() => handleToggleMenu(item.key)}
                      sx={{
                        borderRadius: 2.5,
                        color: hasActiveChild ? 'primary.main' : 'text.primary',
                        fontWeight: 600
                      }}
                    >
                      <ListItemIcon sx={{ color: hasActiveChild ? 'primary.main' : 'text.secondary', minWidth: 40 }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 600 }}
                      />
                      {isMenuOpen ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                  </ListItem>
                  <Collapse in={isMenuOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding sx={{ pl: 2.5 }}>
                      {item.visibleChildren.map((child) => {
                        const isChildActive = location.pathname === child.path;
                        return (
                          <ListItem key={child.label} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                              onClick={() => {
                                navigate(child.path);
                                if (isMobile) onDrawerToggle();
                              }}
                              sx={{
                                borderRadius: 2.5,
                                bgcolor: isChildActive ? 'primary.main' : 'transparent',
                                color: isChildActive ? '#fff' : 'text.primary',
                                '&:hover': {
                                  bgcolor: isChildActive ? 'primary.main' : 'action.hover',
                                }
                              }}
                            >
                              <ListItemIcon sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 28 }}>
                                <Box sx={{
                                  width: 6,
                                  height: 6,
                                  borderRadius: '50%',
                                  bgcolor: isChildActive ? '#fff' : 'text.secondary'
                                }} />
                              </ListItemIcon>
                              <ListItemText
                                primary={child.label}
                                primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: isChildActive ? 600 : 500 }}
                              />
                            </ListItemButton>
                          </ListItem>
                        );
                      })}
                    </List>
                  </Collapse>
                </React.Fragment>
              );
            }
            return null;
          })}
        </List>
      </Box>

      {/* Bottom Profile & Logout Section */}
      <Box sx={{
        p: 1,
        borderTop: '1px solid',
        borderColor: 'divider',
        mt: 'auto',
        bgcolor: 'action.hover',
        transition: 'all 0.3s ease'
      }}>
        <Box sx={{ overflow: 'hidden', flexGrow: 1 }}>
          <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block', fontSize: '0.70rem', opacity: 0.8 }}>
            Last login: Today, {loginTime}
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box component="nav">
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={onDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {sidebarContent}
        </Drawer>
      ) : (
        <Drawer
          variant="persistent"
          open={open}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          <Toolbar />
          {sidebarContent}
        </Drawer>
      )}
    </Box>
  );
}
