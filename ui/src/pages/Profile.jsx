import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, Typography, Box, Card, CardContent, Button, Divider, Alert } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';

import API from '../services/api';
import { FormInput, Loader, ToastNotification, Breadcrumb } from '../components/ReusableComponents';

export default function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // States
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [passwordErrors, setPasswordErrors] = useState({});

  // Profile Form State
  const [profileValues] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    role_id: user?.role_id || '' // not modifiable but part of model
  });

  // Password Form State
  const [passwordValues, setPasswordValues] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordValues({ ...passwordValues, [name]: value });
  };

  // Submit Password Change
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPasswordErrors({});

    const errors = {};
    if (!passwordValues.oldPassword) errors.oldPassword = 'Old password is required.';
    if (!passwordValues.newPassword) errors.newPassword = 'New password is required.';
    if (passwordValues.newPassword !== passwordValues.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }
    if (passwordValues.newPassword && passwordValues.newPassword.length < 6) {
      errors.newPassword = 'New password must be at least 6 characters.';
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    setLoading(true);
    try {
      await API.post('/auth/change-password', {
        oldPassword: passwordValues.oldPassword,
        newPassword: passwordValues.newPassword
      });

      setPasswordValues({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setToast({ open: true, message: 'Password changed successfully.', severity: 'success' });
    } catch (err) {
      setToast({ open: true, message: err.message || 'Failed to change password.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Loader open={loading} />

      <Box sx={{ mb: 3 }}>
        <Breadcrumb items={[{ label: 'Dashboard', href: '/' }, { label: 'My Profile' }]} />
        <Typography variant="h4" sx={{ fontWeight: 800 }}>Account Profile</Typography>
        <Typography variant="body2" color="text.secondary">
          Configure personal details, settings, and credentials security.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Left Side: Profile Edit Form */}
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <PersonIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Personal Particulars</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />

              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormInput 
                      label="First Name"
                      name="first_name"
                      value={profileValues.first_name}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormInput 
                      label="Last Name"
                      name="last_name"
                      value={profileValues.last_name}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormInput 
                      label="Email Address"
                      name="email"
                      type="email"
                      value={profileValues.email}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormInput 
                      label="Assigned Corporate Role (Locked)"
                      name="role"
                      value={user?.role || ''}
                      disabled
                    />
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Side: Security Password Form */}
        <Grid item xs={12} md={5}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <LockIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Security Credentials</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />

              <form onSubmit={handleUpdatePassword}>
                <FormInput 
                  label="Current Password"
                  name="oldPassword"
                  type="password"
                  value={passwordValues.oldPassword}
                  onChange={handlePasswordChange}
                  required
                  error={!!passwordErrors.oldPassword}
                  helperText={passwordErrors.oldPassword}
                />
                <FormInput 
                  label="New Password"
                  name="newPassword"
                  type="password"
                  value={passwordValues.newPassword}
                  onChange={handlePasswordChange}
                  required
                  error={!!passwordErrors.newPassword}
                  helperText={passwordErrors.newPassword}
                />
                <FormInput 
                  label="Confirm New Password"
                  name="confirmPassword"
                  type="password"
                  value={passwordValues.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  error={!!passwordErrors.confirmPassword}
                  helperText={passwordErrors.confirmPassword}
                />
                <Button 
                  variant="contained" 
                  color="secondary" 
                  type="submit" 
                  sx={{ mt: 3, borderRadius: 2.5, px: 3 }}
                >
                  Update Credentials
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <ToastNotification 
        open={toast.open} 
        message={toast.message} 
        severity={toast.severity} 
        onClose={() => setToast({ ...toast, open: false })} 
      />
    </Box>
  );
}
