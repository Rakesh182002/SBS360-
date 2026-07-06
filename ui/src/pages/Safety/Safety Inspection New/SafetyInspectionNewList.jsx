import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';

import API from '../../../services/api';
import { Loader, ToastNotification, AdvancedTable } from '../../../components/ReusableComponents';
import EhsFormDialog from './SafetyInspectionNewDialog';

export default function EhsList() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [inspections, setInspections] = useState([]);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [selectedNsiId, setSelectedNsiId] = useState(null);

  const columns = [
    { id: 'NSIID', label: 'EHS ID', sortable: true },
    { id: 'ProjectName', label: 'Project Name', sortable: true },
    { 
      id: 'InspectionDate', 
      label: 'Inspection Date', 
      sortable: true,
      render: (val) => val ? new Date(val).toLocaleDateString() : '-'
    },
    { id: 'ProjectLocation', label: 'Location', sortable: true },
    { id: 'InspectedByName', label: 'Inspected By', sortable: true },
    { 
      id: 'Status', 
      label: 'Status', 
      sortable: true,
      render: (val) => (
        <Typography component="span" variant="body2" sx={{
          bgcolor: val === 'Completed' || val === 'Confirmed' ? 'success.main' + '20' : 'warning.main' + '20',
          color: val === 'Completed' || val === 'Confirmed' ? 'success.main' : 'warning.main',
          px: 1.5, py: 0.5, borderRadius: 1.5, fontWeight: 600
        }}>
          {val || 'Pending'}
        </Typography>
      )
    }
  ];

  useEffect(() => {
    fetchInspections();
  }, []);

  const fetchInspections = async () => {
    setLoading(true);
    try {
      const response = await API.get('/safety/esh/all');
      setInspections(response.data.data || []);
    } catch (error) {
      setToast({
        open: true,
        message: error.message || 'Failed to load EHS inspections.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddDialog = () => {
    setSelectedNsiId(null);
    setOpenFormDialog(true);
  };

  const handleOpenEditDialog = (id) => {
    setSelectedNsiId(id);
    setOpenFormDialog(true);
  };

  const handleFormSuccess = (msg) => {
    setOpenFormDialog(false);
    setToast({ open: true, message: msg, severity: 'success' });
    fetchInspections();
  };

  const renderActions = (row) => (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
      <IconButton 
        size="small" 
        onClick={() => navigate(`/safetyinspectionnew/view/${row.NSIID}`)}
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
        onClick={() => handleOpenEditDialog(row.NSIID)}
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
          <Typography variant="h4" sx={{ fontWeight: 600 }}>Add New Safety Inspection</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={fetchInspections} size="medium" color="default" sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <RefreshIcon />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAddDialog}
            sx={{ borderRadius: 2.5, px: 3, textTransform: 'none' }}
          >
            New Safety Inspection
          </Button>
        </Box>
      </Box>

      <AdvancedTable
        title="EHS Inspection Reports History"
        columns={columns}
        rows={inspections}
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

      <EhsFormDialog
        open={openFormDialog}
        nsiId={selectedNsiId}
        onClose={() => setOpenFormDialog(false)}
        onSuccess={handleFormSuccess}
      />
    </Box>
  );
}
