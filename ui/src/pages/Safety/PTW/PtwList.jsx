import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, IconButton, Menu, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import LoopIcon from '@mui/icons-material/Loop';

import API from '../../../services/api';
import { Loader, ToastNotification, AdvancedTable } from '../../../components/ReusableComponents';
import PtwFormDialog from './PtwFormDialog';

export default function PtwList() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [ptws, setPtws] = useState([]);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  // Dialog state
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [selectedPtwId, setSelectedPtwId] = useState(null);
  const [selectedPtwType, setSelectedPtwType] = useState('PTWWAH');

  // Menu State
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const columns = [
    { id: 'PTW_type', label: 'Permit Type', sortable: true, render: (val) => {
        if (val === 'PTWWAH') return 'Working at Height Permit';
        if (val === 'PTWWFEX') return 'Excavation Permit';
        if (val === 'PTWHOT') return 'Hot Work Permit';
        if (val === 'PTWLOPT') return 'Lifting Work Permit';
        if (val === 'PTWCONSPC') return 'Confined Space Permit';
        return val || '-';
      }
    },
    { id: 'ProjectTitle', label: 'Project Title', sortable: true },
    {
      id: 'Start_Date_Time',
      label: 'Start Date & Time',
      sortable: true,
      render: (val) => val ? new Date(val).toLocaleString() : '-'
    },
    {
      id: 'End_Date_Time',
      label: 'End Date & Time',
      sortable: true,
      render: (val) => val ? new Date(val).toLocaleString() : '-'
    },
    { id: 'NameOfApplicant', label: 'Applicant Name', sortable: true },
    {
      id: 'CompletedStage',
      label: 'Status',
      sortable: true,
      render: (val, row) => {
        const isConfined = row.PTW_type === 'PTWCONSPC' || row.PTW_type === 'Confined Space Permit';
        if (isConfined) {
          if (val === 1) return 'Stage 1 Completed';
          if (val === 2) return 'Stage 2 Completed';
          if (val === 3) return 'Stage 3 Completed';
          if (val === 4) return 'Stage 4 Completed';
          if (val === 5) return 'Stage 5 in progress';
          if (val === 6) return 'Completed';
          if (val === 7) return 'Revoked';
          return 'Draft';
        } else {
          if (val === 1) return 'Stage 1 Completed';
          if (val === 2) return 'Stage 2 Completed';
          if (val === 3) return 'Stage 3 Completed';
          if (val === 4) return 'Stage 4 Completed';
          if (val === 5) return 'Completed';
          if (val === 6) return 'Revoked';
          return 'Draft';
        }
      }
    }
  ];

  useEffect(() => {
    fetchPtws();
  }, []);

  const fetchPtws = async () => {
    setLoading(true);
    try {
      const response = await API.get('/safety/ptw/all');
      setPtws(response.data.data || []);
    } catch (error) {
      setToast({
        open: true,
        message: error.message || 'Failed to load Permit to Work records.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCreateClick = (type) => {
    setSelectedPtwId(null);
    setSelectedPtwType(type);
    setOpenFormDialog(true);
    handleMenuClose();
  };

  const handleEditClick = (row) => {
    setSelectedPtwId(row.PTW_master_ID);
    setSelectedPtwType(row.PTW_type);
    setOpenFormDialog(true);
  };

  const handleRevokeClick = async (row) => {
    setLoading(true);
    try {
      const nextStage = row.PTW_type === 'PTWCONSPC' ? 7 : 6;
      await API.put(`/safety/ptw/${row.PTW_master_ID}`, {
        PTW_type: row.PTW_type,
        CompletedStage: nextStage
      });
      setToast({ open: true, message: 'Permit status updated successfully.', severity: 'success' });
      fetchPtws();
    } catch (error) {
      setToast({ open: true, message: 'Failed to update permit status.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const renderActions = (row) => (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
      <IconButton
        size="small"
        onClick={() => navigate(`/ptw/view/${row.PTW_master_ID}?type=${row.PTW_type}`)}
        sx={{
          color: 'info.main',
          bgcolor: (theme) => theme.palette.info.main + '15',
          p: 1,
          '&:hover': {
            bgcolor: 'info.main',
            color: '#fff',
            transform: 'scale(1.15)'
          },
          transition: 'all 0.2s'
        }}
      >
        <VisibilityIcon fontSize="small" />
      </IconButton>
      
      {row.CompletedStage < (row.PTW_type === 'PTWCONSPC' ? 6 : 5) && (
        <IconButton
          size="small"
          onClick={() => handleEditClick(row)}
          sx={{
            color: 'primary.main',
            bgcolor: (theme) => theme.palette.primary.main + '15',
            p: 1,
            '&:hover': {
              bgcolor: 'primary.main',
              color: '#fff',
              transform: 'scale(1.15)'
            },
            transition: 'all 0.2s'
          }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
      )}

      {row.CompletedStage >= (row.PTW_type === 'PTWCONSPC' ? 6 : 5) ? (
        <IconButton
          size="small"
          onClick={() => handleRevokeClick(row)}
          title="Revoke Permit"
          sx={{
            color: 'error.main',
            bgcolor: (theme) => theme.palette.error.main + '15',
            p: 1,
            '&:hover': {
              bgcolor: 'error.main',
              color: '#fff',
              transform: 'scale(1.15)'
            },
            transition: 'all 0.2s'
          }}
        >
          <LoopIcon fontSize="small" />
        </IconButton>
      ) : null}
    </Box>
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Loader open={loading} />

      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 4
      }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>Permit To Work (PTW)</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={fetchPtws} size="medium" color="default" sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <RefreshIcon />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleMenuClick}
            sx={{ borderRadius: 2.5, px: 3, textTransform: 'none' }}
          >
            Create New Permit
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => handleCreateClick('PTWHOT')}>Hot Work Permit</MenuItem>
            <MenuItem onClick={() => handleCreateClick('PTWWAH')}>Working at Height Permit</MenuItem>
            <MenuItem onClick={() => handleCreateClick('PTWLOPT')}>Lifting Work Permit</MenuItem>
            <MenuItem onClick={() => handleCreateClick('PTWWFEX')}>Excavation Permit</MenuItem>
            <MenuItem onClick={() => handleCreateClick('PTWCONSPC')}>Confined Space Permit</MenuItem>
          </Menu>
        </Box>
      </Box>

      <AdvancedTable
        title="Active Permits Checklist"
        columns={columns}
        rows={ptws}
        showSearch={true}
        sortable={true}
        showActions={true}
        actions={renderActions}
        showCopy={true}
        showExcel={true}
        showCSV={true}
        showPDF={true}
      />

      <PtwFormDialog
        open={openFormDialog}
        onClose={() => setOpenFormDialog(false)}
        ptwId={selectedPtwId}
        ptwType={selectedPtwType}
        onSuccess={() => {
          setOpenFormDialog(false);
          fetchPtws();
        }}
      />

      <ToastNotification
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </Box>
  );
}
