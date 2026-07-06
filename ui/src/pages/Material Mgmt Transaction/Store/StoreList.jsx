import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';

import API from '../../../services/api';
import { Loader, ToastNotification, AdvancedTable } from '../../../components/ReusableComponents';
import StoreFormDialog from './StoreFormDialog';

export default function StoreList() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteStoreId, setDeleteStoreId] = useState(null);
  const [deleteStoreName, setDeleteStoreName] = useState('');

  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState(null);

  const columns = [
    { id: 'Store_Code', label: 'Store Code', sortable: true },
    { id: 'Branch_Name', label: 'Company Name', sortable: true },
    { 
      id: 'Start_Date', 
      label: 'Start Date', 
      sortable: true,
      render: (val) => {
        if (!val) return '-';
        const parts = val.substring(0, 10).split('-');
        if (parts.length === 3) {
          return `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
        return val;
      }
    },
    { id: 'Store_Name', label: 'Store Name', sortable: true },
    { id: 'Store_Description', label: 'Description', sortable: true }
  ];

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const response = await API.get('/material/stores');
      setStores(response.data.data || []);
    } catch (error) {
      setToast({
        open: true,
        message: error.message || 'Failed to fetch stores list.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddDialog = () => {
    setSelectedStoreId(null);
    setOpenFormDialog(true);
  };

  const handleOpenEditDialog = (storeId) => {
    setSelectedStoreId(storeId);
    setOpenFormDialog(true);
  };

  const handleFormSuccess = (msg) => {
    setOpenFormDialog(false);
    setToast({ open: true, message: msg, severity: 'success' });
    fetchStores();
  };

  const handleOpenDeleteModal = (storeId, storeName) => {
    setDeleteStoreId(storeId);
    setDeleteStoreName(storeName);
    setOpenDeleteModal(true);
  };

  const handleDeleteStore = async () => {
    setLoading(true);
    setOpenDeleteModal(false);
    try {
      await API.delete(`/material/stores/${deleteStoreId}`);
      setToast({
        open: true,
        message: `Store "${deleteStoreName}" successfully deleted.`,
        severity: 'success'
      });
      fetchStores();
    } catch (error) {
      setToast({
        open: true,
        message: error.message || 'Failed to delete store.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const renderActions = (row) => (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
      <IconButton 
        size="small" 
        onClick={() => handleOpenEditDialog(row.StoreID)}
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
      {/* <IconButton 
        size="small" 
        onClick={() => handleOpenDeleteModal(row.StoreID, row.Store_Name)}
        sx={{
          color: 'error.main',
          bgcolor: (theme) => theme.palette.error.main + '15',
          p: 1,
          '&:hover': {
            bgcolor: 'error.main',
            color: '#fff',
            transform: 'scale(1.15)',
            boxShadow: '0 4px 8px rgba(239, 68, 68, 0.3)'
          },
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <DeleteIcon fontSize="small" />
      </IconButton> */}
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
        mb: 4
      }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>Store List</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={fetchStores} size="medium" color="default" sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <RefreshIcon />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAddDialog}
            sx={{ borderRadius: 2.5, px: 3, textTransform: 'none' }}
          >
            Add Store
          </Button>
        </Box>
      </Box>

      <AdvancedTable
        title="Store Details"
        columns={columns}
        rows={stores}
        showSearch={true}
        sortable={true}
        showActions={true}
        actions={renderActions}
        showCopy={true}
        showExcel={true}
        showCSV={true}
        showPDF={true}
      />

      <Dialog 
        open={openDeleteModal} 
        onClose={() => setOpenDeleteModal(false)}
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Confirm Delete Store</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete the store <b>"{deleteStoreName}"</b>?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setOpenDeleteModal(false)} variant="outlined" sx={{ borderRadius: 2, textTransform: 'none' }}>
            Cancel
          </Button>
          <Button onClick={handleDeleteStore} color="error" variant="contained" sx={{ borderRadius: 2, px: 3, textTransform: 'none' }}>
            Yes, Delete Store
          </Button>
        </DialogActions>
      </Dialog>

      <ToastNotification 
        open={toast.open} 
        message={toast.message} 
        severity={toast.severity} 
        onClose={() => setToast({ ...toast, open: false })} 
      />

      <StoreFormDialog
        open={openFormDialog}
        onClose={() => setOpenFormDialog(false)}
        storeId={selectedStoreId}
        onSuccess={handleFormSuccess}
      />
    </Box>
  );
}
