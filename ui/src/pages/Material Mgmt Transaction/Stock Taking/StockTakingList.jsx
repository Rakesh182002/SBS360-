import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';

import API from '../../../services/api';
import { Loader, ToastNotification, AdvancedTable } from '../../../components/ReusableComponents';
import StockTakingFormDialog from './StockTakingFormDialog';

const ADJ_REASONS_MAP = {
  1: 'DataEntry Error',
  2: 'Quality Check',
  3: 'Damage',
  4: 'Annual Adjustment',
  5: 'Miscellaneous'
};

export default function StockTakingList() {
  const navigate = useNavigate();
  const [adjustments, setAdjustments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [openFormDialog, setOpenFormDialog] = useState(false);

  const columns = [
    { id: 'Stock_Taking_Number', label: 'Stocktaking No.', sortable: true, render: (val, row) => val || `SAJ-${row.StockAdjID}` },
    { id: 'Store_Name', label: 'Store Name', sortable: true },
    { id: 'Product_Name', label: 'Product Name', sortable: true },
    // { 
    //   id: 'Quantity', 
    //   label: 'Adjusted Qty', 
    //   sortable: true,
    //   render: (val) => val !== null ? parseInt(val, 10).toLocaleString() : '0'
    // },
    // { 
    //   id: 'ActualStock', 
    //   label: 'Physical Count', 
    //   sortable: true,
    //   render: (val) => val !== null ? parseInt(val, 10).toLocaleString() : '-'
    // },
    // { 
    //   id: 'AdjType', 
    //   label: 'Adjustment Type', 
    //   sortable: true,
    //   render: (val) => val === 1 ? 'Deduction (Deduct)' : 'Addition (Add)'
    // },
    { 
      id: 'AdjReason', 
      label: 'Adjustment Reason', 
      sortable: true,
      render: (val) => ADJ_REASONS_MAP[val] || 'Correction'
    },
    { 
      id: 'Stock_Taking_Date', 
      label: 'Stock Taking Date', 
      sortable: true,
      render: (val) => val ? new Date(val).toLocaleDateString() : '-'
    },
    { 
      id: 'Quantity', 
      label: 'Quantity Adjusted', 
      sortable: true,
      render: (val, row) => {
        if (val === null || val === undefined) return '0';
        const num = parseInt(val, 10);
        return row.AdjType === 1 ? `-${num.toLocaleString()}` : `+${num.toLocaleString()}`;
      }
    },
    // { id: 'Remarks', label: 'Remarks', sortable: true }
  ];

  useEffect(() => {
    fetchAdjustments();
  }, []);

  const fetchAdjustments = async () => {
    setLoading(true);
    try {
      const response = await API.get('/material/stocktaking');
      setAdjustments(response.data.data || []);
    } catch (error) {
      setToast({
        open: true,
        message: error.message || 'Failed to fetch stock adjustments.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddDialog = () => {
    setOpenFormDialog(true);
  };

  const handleFormSuccess = (msg) => {
    setOpenFormDialog(false);
    setToast({ open: true, message: msg, severity: 'success' });
    fetchAdjustments();
  };

  const renderActions = (row) => (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
      <IconButton 
        size="small" 
        onClick={() => navigate(`/stocktaking/view/${row.StockAdjID}`)}
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
          <Typography variant="h4" sx={{ fontWeight: 600 }}>Stocktaking Adjustments</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={fetchAdjustments} size="medium" color="default" sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <RefreshIcon />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAddDialog}
            sx={{ borderRadius: 2.5, px: 3, textTransform: 'none' }}
          >
            New Stocktaking
          </Button>
        </Box>
      </Box>

      <AdvancedTable
        title="Inventory Corrections History"
        columns={columns}
        rows={adjustments}
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

      <StockTakingFormDialog
        open={openFormDialog}
        onClose={() => setOpenFormDialog(false)}
        onSuccess={handleFormSuccess}
      />
    </Box>
  );
}
