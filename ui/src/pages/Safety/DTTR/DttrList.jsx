import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import API from '../../../services/api';
import { Loader, ToastNotification, AdvancedTable } from '../../../components/ReusableComponents';
import DttrFormDialog from './DttrFormDialog';

export default function DttrList() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [safetys, setSafetys] = useState([]);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [selectedSafetyId, setSelectedSafetyId] = useState(null);

  const columns = [
    { id: 'SafetyID', label: 'Safety ID', sortable: true },
    {
      id: 'RepDate',
      label: 'Date',
      sortable: true,
      render: (val) => val ? new Date(val).toLocaleDateString() : '-'
    },
    { id: 'ProjectTitle', label: 'Project Title', sortable: true },
    { id: 'LocationOfWork', label: 'Location of Work', sortable: true },
    { id: 'SubmittedByName', label: 'Supervisor', sortable: true }
  ];

  useEffect(() => {
    fetchSafetys();
  }, []);

  const fetchSafetys = async () => {
    setLoading(true);
    try {
      const response = await API.get('/safety');
      setSafetys(response.data.data || []);
    } catch (error) {
      setToast({
        open: true,
        message: error.message || 'Failed to load safety declarations.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddDialog = () => {
    setSelectedSafetyId(null);
    setOpenFormDialog(true);
  };

  const handleOpenEditDialog = (id) => {
    setSelectedSafetyId(id);
    setOpenFormDialog(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this safety record?')) return;
    setLoading(true);
    try {
      await API.delete(`/safety/${id}`);
      setToast({ open: true, message: 'Safety record deleted successfully.', severity: 'success' });
      fetchSafetys();
    } catch (error) {
      setToast({ open: true, message: error.message || 'Failed to delete safety record.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleFormSuccess = (msg) => {
    setOpenFormDialog(false);
    setToast({ open: true, message: msg, severity: 'success' });
    fetchSafetys();
  };

  const renderActions = (row) => (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
      <IconButton
        size="small"
        onClick={() => navigate(`/dttr/view/${row.SafetyID}`)}
        sx={{
          color: 'info.main',
          bgcolor: (theme) => theme.palette.info.main + '15',
          p: 1,
          '&:hover': {
            bgcolor: 'info.main',
            color: '#fff',
            transform: 'scale(1.15)'
          },
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <VisibilityIcon fontSize="small" />
      </IconButton>
      <IconButton
        size="small"
        onClick={() => handleOpenEditDialog(row.SafetyID)}
        sx={{
          color: 'primary.main',
          bgcolor: (theme) => theme.palette.primary.main + '15',
          p: 1,
          '&:hover': {
            bgcolor: 'primary.main',
            color: '#fff',
            transform: 'scale(1.15)'
          },
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <EditIcon fontSize="small" />
      </IconButton>
      <IconButton
        size="small"
        onClick={() => handleDelete(row.SafetyID)}
        sx={{
          color: 'error.main',
          bgcolor: (theme) => theme.palette.error.main + '15',
          p: 1,
          '&:hover': {
            bgcolor: 'error.main',
            color: '#fff',
            transform: 'scale(1.15)'
          },
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
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
          <Typography variant="h4" sx={{ fontWeight: 600 }}>Daily Toolbox Talk Record</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={fetchSafetys} size="medium" color="default" sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <RefreshIcon />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAddDialog}
            sx={{ borderRadius: 2.5, px: 3, textTransform: 'none' }}
          >
            New DTTR
          </Button>
        </Box>
      </Box>

      <AdvancedTable
        title="DTTR Declarations History"
        columns={columns}
        rows={safetys}
        showSearch={true}
        sortable={true}
        showActions={true}
        actions={renderActions}
        showCopy={true}
        showExcel={true}
        showCSV={true}
        showPDF={true}
      />

      <ToastNotification
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast({ ...toast, open: false })}
      />

      <DttrFormDialog
        open={openFormDialog}
        safetyId={selectedSafetyId}
        onClose={() => setOpenFormDialog(false)}
        onSuccess={handleFormSuccess}
      />
    </Box>
  );
}
