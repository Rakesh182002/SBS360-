import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import ShieldIcon from '@mui/icons-material/Shield';

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <Box sx={{ 
      minHeight: '80vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      textAlign: 'center',
      p: 3 
    }}>
      <ShieldIcon color="error" sx={{ fontSize: 80, mb: 2 }} />
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Access Denied
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 480, mb: 4 }}>
        You do not have the required role or administrative privileges to view this page. If you think this is a mistake, please reach out to your system administrator.
      </Typography>
      <Button 
        variant="contained" 
        size="large" 
        onClick={() => navigate('/')}
        sx={{ borderRadius: 2.5 }}
      >
        Go to Dashboard
      </Button>
    </Box>
  );
}
