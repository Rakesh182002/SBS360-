import React, { useState, useEffect } from 'react';
import {
  Grid, Typography, Box, Card, CardContent, Divider,
  Button, List, ListItem, ListItemText, ListItemAvatar, Avatar,
  Chip, Table, TableBody, TableCell, TableHead, TableRow, useTheme
} from '@mui/material';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Cell, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// Icons
import PeopleIcon from '@mui/icons-material/People';
import SpeedIcon from '@mui/icons-material/Speed';
import ShieldIcon from '@mui/icons-material/Shield';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import EventIcon from '@mui/icons-material/Event';

import API from '../services/api';
import { StatCard, Loader, Breadcrumb } from '../components/ReusableComponents';

export default function Dashboard() {
  const theme = useTheme();

  // State
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await API.get('/analytics/dashboard');
      setDashboardData(res.data.data);
    } catch (err) {
      console.error('Error fetching dashboard analytics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const COLORS = ['#6366f1', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'];

  if (loading && !dashboardData) {
    return <Loader open={loading} />;
  }

  const { kpis, userStats, timeline, financial } = dashboardData || {};

  // Formatted date helper for calendar
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <Box>
      {/* <Loader open={loading} /> */}

      {/* Top Header Section */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' },
        gap: 2,
        mb: 4
      }}>
        <Box>
          <Breadcrumb items={[{ label: 'Home' }, { label: 'Dashboard' }]} />
          <Typography variant="h4" sx={{ fontWeight: 800 }}>Dashboard Overview</Typography>
          <Typography variant="body2" color="text.secondary">
            Welcome to Smart 360. Here is your enterprise performance at a glance.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchDashboardData}
          sx={{ borderRadius: 2, alignSelf: { xs: 'flex-start', sm: 'auto' } }}
        >
          Refresh Data
        </Button>
      </Box>

      {/* 1. KPI Stats Cards Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Accounts"
            value={kpis?.totalUsers || 0}
            icon={<PeopleIcon />}
            color="#6366f1"
            trend="+12%"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Active Sessions"
            value={kpis?.activeLogins24h || 0}
            icon={<SpeedIcon />}
            color="#10b981"
            trend="+4%"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Assigned Roles"
            value={kpis?.totalRoles || 0}
            icon={<ShieldIcon />}
            color="#f59e0b"
            trend="Stable"
          />
        </Grid>
      </Grid>

      {/* 2. Charts Visualization Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Revenue Analytics (Area Chart) */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Financial Operations Analytics</Typography>
              <Box sx={{ height: 320, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={financial?.revenueChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ec4899" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" name="Gross Revenue ($)" />
                    <Area type="monotone" dataKey="sales" stroke="#ec4899" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" name="Target Sales ($)" />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* User Roles Distribution (Pie Chart) */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Account Type Matrix</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                Distribution of system user accounts by role
              </Typography>
              <Box sx={{ height: 240, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={userStats?.usersByRole}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="count"
                      nameKey="role_name"
                    >
                      {userStats?.usersByRole?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} Accounts`, 'Count']} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
                {userStats?.usersByRole?.map((item, idx) => (
                  <Box key={item.role_name} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: COLORS[idx % COLORS.length] }} />
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>{item.role_name}</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{item.count}</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 3. Detailed Data & Logs Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Recent Transactions List */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Recent Transactions</Typography>
              <Table size="medium">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Customer</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Payment Method</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {financial?.recentTransactions?.map((txn) => (
                    <TableRow key={txn.id} hover>
                      <TableCell sx={{ fontWeight: 500 }}>{txn.id}</TableCell>
                      <TableCell>{txn.customer}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>${txn.amount.toFixed(2)}</TableCell>
                      <TableCell>{txn.method}</TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={txn.status}
                          color={txn.status === 'Completed' ? 'success' : txn.status === 'Pending' ? 'warning' : 'error'}
                          variant="filled"
                          sx={{ fontWeight: 600, borderRadius: 1.5 }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>

        {/* Activity Log/Timeline */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>System Activity Log</Typography>
              <List sx={{ p: 0 }}>
                {timeline?.recentLogins?.map((log, idx) => (
                  <ListItem key={idx} sx={{ px: 0, py: 1.5, alignItems: 'flex-start' }}>
                    <ListItemAvatar sx={{ minWidth: 44 }}>
                      <Avatar sx={{ bgcolor: log.status === 'Success' ? 'success.light' : 'error.light', width: 32, height: 32 }}>
                        {log.status === 'Success' ? <ArrowUpwardIcon sx={{ fontSize: 18 }} /> : <ArrowDownwardIcon sx={{ fontSize: 18 }} />}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${log.first_name} ${log.last_name}`}
                      primaryTypographyProps={{ fontWeight: 600, fontSize: '0.875rem' }}
                      secondary={
                        <>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            Logged in from: {log.ip_address}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(log.login_time).toLocaleTimeString()}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 4. Calendar and Quick Actions */}
      <Grid container spacing={3}>
        {/* Simple Calendar Widget */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Calendar Schedule</Typography>
                <Chip icon={<EventIcon />} label={today.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })} variant="outlined" sx={{ fontWeight: 600 }} />
              </Box>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(7, 1fr)', 
                gap: 0.75, 
                textAlign: 'center',
                mb: 1
              }}>
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                  <Typography key={i} variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                    {d}
                  </Typography>
                ))}
                {calendarDays.map((day) => {
                  const isToday = day === today.getDate();
                  return (
                    <Box 
                      key={day} 
                      sx={{ 
                        p: { xs: 0.5, sm: 1, md: 1.5 }, 
                        borderRadius: 2, 
                        bgcolor: isToday ? 'primary.main' : 'action.hover', 
                        color: isToday ? '#fff' : 'text.primary',
                        fontWeight: isToday ? 700 : 500,
                        fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' },
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        aspectRatio: '1/1',
                        transition: 'all 0.2s',
                        '&:hover': {
                          bgcolor: isToday ? 'primary.main' : 'divider',
                          transform: 'scale(1.05)'
                        }
                      }}
                    >
                      {day}
                    </Box>
                  );
                })}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Operations Widget */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Quick Operations</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Frequently used actions for access control and profile credentials management.
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button 
                    fullWidth 
                    variant="outlined" 
                    startIcon={<PersonIcon />} 
                    onClick={() => navigate('/profile')}
                    sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1, borderRadius: 3, borderStyle: 'dashed' }}
                  >
                    My Profile
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button 
                    fullWidth 
                    variant="outlined" 
                    startIcon={<LockIcon />}
                    onClick={() => navigate('/profile')}
                    sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1, borderRadius: 3, borderStyle: 'dashed' }}
                  >
                    Change Password
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
