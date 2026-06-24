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
import VehicleFormDialog from './VehicleFormDialog';

export default function VehicleList() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Toast notifications
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  
  // Delete modal state
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteVehicleId, setDeleteVehicleId] = useState(null);
  const [deleteVehicleName, setDeleteVehicleName] = useState('');

  // Vehicle dialog state
  const [openVehicleDialog, setOpenVehicleDialog] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);

  // Table Column Definitions
  const columns = [
    { id: 'Vehicle_Name', label: 'Vehicle Name', sortable: true },
    { id: 'Vehicle_Company', label: 'Vehicle Company', sortable: true },
    { id: 'Vehicle_Model', label: 'Vehicle Model', sortable: true },
    { id: 'Vehicle_Type', label: 'Vehicle Type', sortable: true },
    { id: 'Vehicle_Number', label: 'Vehicle Number', sortable: true },
    { id: 'COE_Regn_Number', label: 'COE Registration', sortable: true }
  ];

  // Load vehicles list on mount
  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await API.get('/transports');
      setVehicles(response.data.data || []);
    } catch (error) {
      setToast({
        open: true,
        message: error.message || 'Failed to fetch vehicles.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddDialog = () => {
    setSelectedVehicleId(null);
    setOpenVehicleDialog(true);
  };

  const handleOpenEditDialog = (vehicleId) => {
    setSelectedVehicleId(vehicleId);
    setOpenVehicleDialog(true);
  };

  const handleDialogSuccess = () => {
    setOpenVehicleDialog(false);
    fetchVehicles();
  };

  const handleOpenDeleteModal = (vehicleId, vehicleName) => {
    setDeleteVehicleId(vehicleId);
    setDeleteVehicleName(vehicleName);
    setOpenDeleteModal(true);
  };

  const handleDeleteVehicle = async () => {
    setLoading(true);
    setOpenDeleteModal(false);
    try {
      await API.delete(`/transports/${deleteVehicleId}`);
      setToast({
        open: true,
        message: `Vehicle "${deleteVehicleName}" successfully deleted.`,
        severity: 'success'
      });
      fetchVehicles();
    } catch (error) {
      setToast({
        open: true,
        message: error.message || 'Failed to delete vehicle.',
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
        onClick={() => navigate(`/vehicle/view/${row.TransportID}`)}
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
        onClick={() => handleOpenEditDialog(row.TransportID)}
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
        onClick={() => handleOpenDeleteModal(row.TransportID, row.Vehicle_Name)}
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
          <Typography variant="h4" sx={{ fontWeight: 600 }}>Vehicle Details</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={fetchVehicles} size="medium" color="default" sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <RefreshIcon />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAddDialog}
            sx={{ borderRadius: 2.5, px: 3 }}
          >
            Add Vehicle
          </Button>
        </Box>
      </Box>

      {/* Advanced Reusable Table */}
      <AdvancedTable
        title="Vehicle Details"
        columns={columns}
        rows={vehicles}
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
        <DialogTitle sx={{ fontWeight: 800 }}>Confirm Delete Vehicle</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete the vehicle <b>"{deleteVehicleName}"</b>?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setOpenDeleteModal(false)} variant="outlined" sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Button onClick={handleDeleteVehicle} color="error" variant="contained" sx={{ borderRadius: 2, px: 3 }}>
            Yes, Delete Vehicle
          </Button>
        </DialogActions>
      </Dialog>

      <VehicleFormDialog
        open={openVehicleDialog}
        onClose={() => setOpenVehicleDialog(false)}
        vehicleId={selectedVehicleId}
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
