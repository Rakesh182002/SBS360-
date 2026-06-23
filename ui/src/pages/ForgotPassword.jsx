import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Button, TextField, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import API from '../services/api';
import { Loader } from '../components/ReusableComponents';

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [debugToken, setDebugToken] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setDebugToken('');

    if (!username) {
      setError('Username is required.');
      return;
    }

    setLoading(true);

    try {
      const res = await API.post('/auth/forgot-password', { username });
      setMessage(res.data.message);
      if (res.data.debugToken) {
        setDebugToken(res.data.debugToken);
      }
    } catch (err) {
      setError(err.message || 'Failed to request reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      bgcolor: 'background.default',
      px: 2
    }}>
      <Loader open={loading} />

      <Card sx={{ width: '100%', maxWidth: 440, borderRadius: 4, p: 1 }}>
        <CardContent>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate('/login')}
            sx={{ mb: 2, color: 'text.secondary' }}
          >
            Back to Sign In
          </Button>

          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>Forgot Password?</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Enter your username, and we will simulate sending a password reset token.
          </Typography>

          <form onSubmit={handleSubmit}>
            {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            {message && (
              <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
                {message}
              </Alert>
            )}

            <TextField
              fullWidth
              margin="normal"
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={!!message}
            />

            {!message ? (
              <Button
                fullWidth
                variant="contained"
                size="large"
                type="submit"
                sx={{ py: 1.5, mt: 2, borderRadius: 2.5 }}
              >
                Send Reset Code
              </Button>
            ) : (
              <Button
                fullWidth
                variant="outlined"
                size="large"
                onClick={() => navigate('/reset-password', { state: { token: debugToken } })}
                sx={{ py: 1.5, mt: 2, borderRadius: 2.5 }}
              >
                Go to Reset Screen
              </Button>
            )}
          </form>

          {debugToken && (
            <Box sx={{ mt: 3, p: 2, bgcolor: 'action.hover', borderRadius: 2, border: '1px dashed', borderColor: 'primary.main' }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 600, mb: 1 }}>
                DEVELOPMENT SIMULATED RESET CODE:
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 700, wordBreak: 'break-all', color: 'primary.main' }}>
                {debugToken}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
