import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';

import API from '../../../services/api';
import { Loader, ToastNotification, AdvancedTable } from '../../../components/ReusableComponents';
import SupplierFormDialog from './SupplierFormDialog';

export default function SupplierList() {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Toast notifications
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  
  // Delete modal state
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteSupplierId, setDeleteSupplierId] = useState(null);
  const [deleteSupplierName, setDeleteSupplierName] = useState('');

  // Supplier dialog state
  const [openSupplierDialog, setOpenSupplierDialog] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState(null);

  // Table Column Definitions
  const columns = [
    { id: 'SupplierDisplayID', label: 'Supplier ID', sortable: true },
    { id: 'Company_Name', label: 'Company Name', sortable: true },
    { id: 'Mobile', label: 'Mobile Phone', sortable: true },
    { id: 'Spoc_Name', label: 'SPOC Name', sortable: true },
    { id: 'Supplier_Description', label: 'Description', sortable: true }
  ];

  // Load suppliers list on mount
  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const response = await API.get('/suppliers');
      setSuppliers(response.data.data || []);
    } catch (error) {
      setToast({
        open: true,
        message: error.message || 'Failed to fetch suppliers.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddDialog = () => {
    setSelectedSupplierId(null);
    setOpenSupplierDialog(true);
  };

  const handleOpenEditDialog = (supplierId) => {
    setSelectedSupplierId(supplierId);
    setOpenSupplierDialog(true);
  };

  const handleDialogSuccess = () => {
    setOpenSupplierDialog(false);
    fetchSuppliers();
  };

  const handleOpenDeleteModal = (supplierId, companyName) => {
    setDeleteSupplierId(supplierId);
    setDeleteSupplierName(companyName);
    setOpenDeleteModal(true);
  };

  const handleDeleteSupplier = async () => {
    setLoading(true);
    setOpenDeleteModal(false);
    try {
      await API.delete(`/suppliers/${deleteSupplierId}`);
      setToast({
        open: true,
        message: `Supplier "${deleteSupplierName}" successfully deleted.`,
        severity: 'success'
      });
      fetchSuppliers();
    } catch (error) {
      setToast({
        open: true,
        message: error.message || 'Failed to delete supplier.',
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
        onClick={() => navigate(`/supplier/view/${row.SupplierID}`)}
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
        onClick={() => handleOpenEditDialog(row.SupplierID)}
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
      <IconButton 
        size="small" 
        onClick={() => handleOpenDeleteModal(row.SupplierID, row.Company_Name)}
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
      </IconButton>
    </Box>
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Loader open={loading} />

      {/* Header section */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' },
        gap: 2,
        mb: 4
      }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>Supplier Details</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={fetchSuppliers} size="medium" color="default" sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <RefreshIcon />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAddDialog}
            sx={{ borderRadius: 2.5, px: 3 }}
          >
            Add Supplier
          </Button>
        </Box>
      </Box>

      {/* Advanced Reusable Table */}
      <AdvancedTable
        title="Supplier Details"
        columns={columns}
        rows={suppliers}
        showSearch={true}
        sortable={true}
        showActions={true}
        actions={renderActions}
        showCopy={true}
        showExcel={true}
        showCSV={true}
        showPDF={true}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={openDeleteModal} 
        onClose={() => setOpenDeleteModal(false)}
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Confirm Delete Supplier</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete the supplier <b>"{deleteSupplierName}"</b>?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setOpenDeleteModal(false)} variant="outlined" sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Button onClick={handleDeleteSupplier} color="error" variant="contained" sx={{ borderRadius: 2, px: 3 }}>
            Yes, Delete Supplier
          </Button>
        </DialogActions>
      </Dialog>

      <SupplierFormDialog
        open={openSupplierDialog}
        onClose={() => setOpenSupplierDialog(false)}
        supplierId={selectedSupplierId}
        onSuccess={handleDialogSuccess}
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
