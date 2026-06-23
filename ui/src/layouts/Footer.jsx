import React from 'react';
import { Box, Typography } from '@mui/material';

export default function Footer() {
  return (
    <Box 
      component="footer" 
      sx={{ 
        py: 2.5, 
        px: 2, 
        mt: 'auto', // Push to bottom of flex layout
        borderTop: '1px solid', 
        borderColor: 'divider',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: 'text.secondary'
      }}
    >
      <Typography variant="caption">
        &copy; {new Date().getFullYear()} Smart 360 Enterprise. All rights reserved.
      </Typography>
      <Typography variant="caption" sx={{ fontWeight: 600 }}>
        Version 1.0.0 (Production)
      </Typography>
    </Box>
  );
}
