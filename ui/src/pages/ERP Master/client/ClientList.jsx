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
import ClientFormDialog from './ClientFormDialog';

export default function ClientList() {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Toast notifications
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  
  // Delete modal state
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteClientId, setDeleteClientId] = useState(null);
  const [deleteClientName, setDeleteClientName] = useState('');

  // Client dialog state
  const [openClientDialog, setOpenClientDialog] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(null);

  const handleOpenAddDialog = () => {
    setSelectedClientId(null);
    setOpenClientDialog(true);
  };

  const handleOpenEditDialog = (clientId) => {
    setSelectedClientId(clientId);
    setOpenClientDialog(true);
  };

  const handleDialogSuccess = () => {
    setOpenClientDialog(false);
    fetchClients();
  };

  // Table Column Definitions
  const columns = [
    { id: 'ClientDisplayID', label: 'Client ID', sortable: true },
    { id: 'Company_Name', label: 'Company Name', sortable: true },
    { id: 'Email', label: 'Email', sortable: true },
    { id: 'Mobile', label: 'Mobile', sortable: true },
    { id: 'City', label: 'City', sortable: true }
  ];

  // Load clients list on mount
  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await API.get('/clients');
      setClients(response.data.data || []);
    } catch (error) {
      setToast({
        open: true,
        message: error.message || 'Failed to fetch clients.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDeleteModal = (clientId, companyName) => {
    setDeleteClientId(clientId);
    setDeleteClientName(companyName);
    setOpenDeleteModal(true);
  };

  const handleDeleteClient = async () => {
    setLoading(true);
    setOpenDeleteModal(false);
    try {
      await API.delete(`/clients/${deleteClientId}`);
      setToast({
        open: true,
        message: `Client "${deleteClientName}" successfully deleted.`,
        severity: 'success'
      });
      fetchClients();
    } catch (error) {
      setToast({
        open: true,
        message: error.message || 'Failed to delete client.',
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
        onClick={() => navigate(`/client/view/${row.ClientID}`)}
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
        onClick={() => handleOpenEditDialog(row.ClientID)}
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
        onClick={() => handleOpenDeleteModal(row.ClientID, row.Company_Name)}
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
          <Typography variant="h4" sx={{ fontWeight: 600 }}>Client Details</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={fetchClients} size="medium" color="default" sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <RefreshIcon />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAddDialog}
            sx={{ borderRadius: 2.5, px: 3 }}
          >
            Add Client
          </Button>
        </Box>
      </Box>

      {/* Advanced Reusable Table */}
      <AdvancedTable
        title="Client Details"
        columns={columns}
        rows={clients}
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
        <DialogTitle sx={{ fontWeight: 800 }}>Confirm Delete Client</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete the client <b>"{deleteClientName}"</b>?
          </Typography>
          {/* <Typography variant="body2" color="error.main" sx={{ mt: 1, fontWeight: 500 }}>
            Warning: This action will soft-delete the client profile from the active directory.
          </Typography> */}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setOpenDeleteModal(false)} variant="outlined" sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Button onClick={handleDeleteClient} color="error" variant="contained" sx={{ borderRadius: 2, px: 3 }}>
            Yes, Delete Client
          </Button>
        </DialogActions>
      </Dialog>

      <ToastNotification 
        open={toast.open} 
        message={toast.message} 
        severity={toast.severity} 
        onClose={() => setToast({ ...toast, open: false })} 
      />

      <ClientFormDialog
        open={openClientDialog}
        onClose={() => setOpenClientDialog(false)}
        clientId={selectedClientId}
        onSuccess={handleDialogSuccess}
      />
    </Box>
  );
}
