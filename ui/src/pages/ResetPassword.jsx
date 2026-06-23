import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Button, TextField, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import API from '../services/api';
import { Loader } from '../components/ReusableComponents';

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  // Auto prefill token if passed from forgot password screen
  const [token, setToken] = useState(location.state?.token || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!token || !newPassword || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const res = await API.post('/auth/reset-password', { token, newPassword });
      setMessage(res.data.message);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to reset password. The token may be invalid.');
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

          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>Reset Password</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Enter your reset code and choose a new password for your account.
          </Typography>

          <form onSubmit={handleSubmit}>
            {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            {message && (
              <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
                {message}. Redirecting to sign in...
              </Alert>
            )}

            <TextField
              fullWidth
              margin="normal"
              label="Reset Code (Token)"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
              disabled={!!message}
            />

            <TextField
              fullWidth
              margin="normal"
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              disabled={!!message}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={!!message}
            />

            <Button
              fullWidth
              variant="contained"
              size="large"
              type="submit"
              sx={{ py: 1.5, mt: 3, borderRadius: 2.5 }}
              disabled={!!message}
            >
              Reset Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
