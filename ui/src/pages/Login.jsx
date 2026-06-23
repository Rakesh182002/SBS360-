import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, Card, CardContent, Typography, Button, TextField, 
  Alert, InputAdornment, IconButton, Link, Divider
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockOpenIcon from '@mui/icons-material/LockOpen';

import { loginStart, loginSuccess, loginFailure } from '../redux/slices/authSlice';
import API from '../services/api';
import { Loader } from '../components/ReusableComponents';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  // States
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Target route to redirect to after successful login
  const from = location.state?.from?.pathname || '/Dashboard';

  useEffect(() => {
    // If already authenticated, redirect
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!username || !password) {
      setValidationError('Please fill in all fields.');
      return;
    }

    dispatch(loginStart());

    try {
      const res = await API.post('/auth/login', { username, password });
      dispatch(loginSuccess(res.data.data));
      navigate(from, { replace: true });
    } catch (err) {
      dispatch(loginFailure(err.message || 'Login failed. Invalid credentials.'));
    }
  };

  // Helper for developers to test different roles quickly
  const handleQuickLogin = (userVal) => {
    setUsername(userVal);
    if (userVal === 'admin') {
      setPassword('abcd1234');
    } else {
      setPassword('password123');
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      bgcolor: 'background.default',
      px: 2,
      py: 4
    }}>
      <Loader open={loading} />

      <Card sx={{ width: '100%', maxWidth: 440, borderRadius: 4, p: 1 }}>
        <CardContent>
          {/* Logo & Header */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Box sx={{ 
              width: 48, 
              height: 48, 
              borderRadius: 2, 
              bgcolor: 'primary.main', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 800,
              fontSize: '1.5rem',
              mb: 1.5
            }}>
              360
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>Welcome Back</Typography>
            <Typography variant="body2" color="text.secondary">Enter credentials to access SBS 360</Typography>
          </Box>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {(error || validationError) && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                {validationError || error}
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
            />

            <TextField
              fullWidth
              margin="normal"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 1 }}>
              <Link 
                component="button" 
                type="button" 
                variant="body2" 
                onClick={() => navigate('/forgot-password')}
                sx={{ fontWeight: 600, color: 'primary.main', textDecoration: 'none' }}
              >
                Forgot Password?
              </Link>
            </Box>

            <Button
              fullWidth
              variant="contained"
              size="large"
              type="submit"
              startIcon={<LockOpenIcon />}
              sx={{ py: 1.5, mt: 1, borderRadius: 2.5 }}
            >
              Sign In
            </Button>
          </form>

          <Divider sx={{ my: 3 }}>
            <Typography variant="caption" color="text.secondary" sx={{ px: 1, fontWeight: 500 }}>
              QUICK SEED ACCOUNT LOGINS
            </Typography>
          </Divider>

          {/* Quick Access Account buttons */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Button size="small" variant="outlined" onClick={() => handleQuickLogin('admin')} sx={{ fontSize: '0.75rem', py: 0.5 }}>
                Super Admin
              </Button>
              <Button size="small" variant="outlined" onClick={() => handleQuickLogin('mgemp1')} sx={{ fontSize: '0.75rem', py: 0.5 }}>
                Manager
              </Button>
              <Button size="small" variant="outlined" onClick={() => handleQuickLogin('supemp2')} sx={{ fontSize: '0.75rem', py: 0.5 }}>
                Supervisor
              </Button>
              <Button size="small" variant="outlined" onClick={() => handleQuickLogin('workemp3')} sx={{ fontSize: '0.75rem', py: 0.5 }}>
                Worker
              </Button>
            </Box>
            <Typography variant="caption" color="text.secondary" align="center" sx={{ display: 'block', mt: 0.5 }}>
              Default Passwords: <b>abcd1234</b> (Super Admin) / <b>password123</b> (Others)
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
