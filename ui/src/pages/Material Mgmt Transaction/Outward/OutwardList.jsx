import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Button, IconButton, Card, CardContent, Grid, TextField
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';

import API from '../../../services/api';
import { Loader, ToastNotification, AdvancedTable } from '../../../components/ReusableComponents';
import OutwardFormDialog from './OutwardFormDialog';

const OUTWARD_TYPE_MAP = {
  1: 'Delivery Order',
  2: 'Transfer Order',
  3: 'Return Order',
  4: 'Material Request',
  5: 'Miscellaneous'
};

export default function OutwardList() {
  const navigate = useNavigate();
  const [outwards, setOutwards] = useState([]);
  const [loading, setLoading] = useState(false);

  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [isFiltered, setIsFiltered] = useState(false);

  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [selectedOutwardId, setSelectedOutwardId] = useState(null);

  const columns = [
    { id: 'Outward_Number', label: 'Outward Number', sortable: true, render: (val, row) => val || `OUW-${row.Outward_ID}` },
    { id: 'Store_Name', label: 'Store Name', sortable: true },
    { id: 'Client_Name', label: 'Client Name', sortable: true },
    { id: 'DO_Number', label: 'DO No.', sortable: true },
    { 
      id: 'Outward_Type', 
      label: 'Outward Type', 
      sortable: true,
      render: (val) => OUTWARD_TYPE_MAP[val] || 'Others'
    },
     { 
      id: 'Delivery_Date', 
      label: 'Delivery Date', 
      sortable: true, 
      render: (val) => val ? new Date(val).toLocaleDateString() : '-' 
    },
 { 
      id: 'DraftFlag', 
      label: 'Status', 
      sortable: true,
      render: (val) => val === 1 ? 'Confirmed' : 'Draft'
    }
  ];

  useEffect(() => {
    fetchOutwards();
  }, []);

  const fetchOutwards = async () => {
    setLoading(true);
    try {
      const response = await API.get('/material/outwards');
      setOutwards(response.data.data || []);
      setIsFiltered(false);
    } catch (error) {
      setToast({
        open: true,
        message: error.message || 'Failed to fetch outward transactions.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilter = async (e) => {
    if (e) e.preventDefault();
    if (!dateFrom && !dateTo) {
      setToast({ open: true, message: 'Please select a date range to filter.', severity: 'warning' });
      return;
    }

    setLoading(true);
    try {
      const response = await API.post('/material/reports/outward', {
        dateFrom: dateFrom || null,
        dateTo: dateTo || null
      });
      setOutwards(response.data.data || []);
      setIsFiltered(true);
      setToast({ open: true, message: 'Report filter applied successfully.', severity: 'success' });
    } catch (error) {
      setToast({
        open: true,
        message: error.message || 'Failed to apply filter.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilter = () => {
    setDateFrom('');
    setDateTo('');
    fetchOutwards();
  };

  const handleOpenAddDialog = () => {
    setSelectedOutwardId(null);
    setOpenFormDialog(true);
  };

  const handleOpenEditDialog = (outwardId) => {
    setSelectedOutwardId(outwardId);
    setOpenFormDialog(true);
  };

  const handleFormSuccess = (msg) => {
    setOpenFormDialog(false);
    setToast({ open: true, message: msg, severity: 'success' });
    if (isFiltered) {
      handleApplyFilter();
    } else {
      fetchOutwards();
    }
  };

  const renderActions = (row) => (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
      <IconButton 
        size="small" 
        onClick={() => navigate(`/outward/view/${row.Outward_ID}`)}
        sx={{
          color: 'info.main',
          bgcolor: (theme) => theme.palette.info.main + '15',
          p: 1,
          '&:hover': {
            bgcolor: 'info.main',
            color: '#fff',
            transform: 'scale(1.15)',
            boxShadow: '0 4px 8px rgba(0, 188, 212, 0.3)'
          },
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <VisibilityIcon fontSize="small" />
      </IconButton>
      <IconButton 
        size="small" 
        onClick={() => handleOpenEditDialog(row.Outward_ID)}
        sx={{
          color: 'primary.main',
          bgcolor: (theme) => theme.palette.primary.main + '15',
          p: 1,
          '&:hover': {
            bgcolor: 'primary.main',
            color: '#fff',
            transform: 'scale(1.15)',
            boxShadow: (theme) => `0 4px 8px ${theme.palette.primary.main}40`
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
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' },
        gap: 2,
        mb: 3
      }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>Outward Transactions</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={handleClearFilter} size="medium" color="default" sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <RefreshIcon />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAddDialog}
            sx={{ borderRadius: 2.5, px: 3, textTransform: 'none' }}
          >
            Create Outward DO
          </Button>
        </Box>
      </Box>

      <AdvancedTable
        title="Outward DOs"
        columns={columns}
        rows={outwards}
        showSearch={true}
        sortable={true}
        showActions={true}
        actions={renderActions}
        showCopy={false}
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

      <OutwardFormDialog
        open={openFormDialog}
        onClose={() => setOpenFormDialog(false)}
        outwardId={selectedOutwardId}
        onSuccess={handleFormSuccess}
      />
    </Box>
  );
}
