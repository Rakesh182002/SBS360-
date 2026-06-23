import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      textAlign: 'center',
      bgcolor: 'background.default',
      p: 3 
    }}>
      <ErrorOutlineIcon color="primary" sx={{ fontSize: 90, mb: 2 }} />
      <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
        404 Not Found
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 440, mb: 4 }}>
        The page you are looking for does not exist, has been removed, or is temporarily unavailable.
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
