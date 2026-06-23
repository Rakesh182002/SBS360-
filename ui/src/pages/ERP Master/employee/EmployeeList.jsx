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
import EmployeeFormDialog from './EmployeeFormDialog';

export default function EmployeeList() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Toast notifications
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  
  // Form Dialog state
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [editEmployeeId, setEditEmployeeId] = useState(null);

  // Delete modal state
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteEmployeeId, setDeleteEmployeeId] = useState(null);
  const [deleteEmployeeName, setDeleteEmployeeName] = useState('');

  const handleFormSuccess = (msg) => {
    setToast({ open: true, message: msg, severity: 'success' });
    fetchEmployees();
  };

  // Table Column Definitions
  const columns = [
    { id: 'EmpID', label: 'Employee ID', sortable: true },
    { id: 'FirstName', label: 'First Name', sortable: true },
    { id: 'LastName', label: 'Last Name', sortable: true },
    { id: 'DoJ', label: 'Date of Join', sortable: true },
    { id: 'Designation', label: 'Designation', sortable: true },
    { id: 'GroupName', label: 'Job Group', sortable: true }
  ];

  // Load employees list on mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await API.get('/employees');
      setEmployees(response.data.data || []);
    } catch (error) {
      setToast({
        open: true,
        message: error.message || 'Failed to fetch employees.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDeleteModal = (employeeId, firstName, lastName) => {
    setDeleteEmployeeId(employeeId);
    setDeleteEmployeeName(`${firstName || ''} ${lastName || ''}`.trim());
    setOpenDeleteModal(true);
  };

  const handleDeleteEmployee = async () => {
    setLoading(true);
    setOpenDeleteModal(false);
    try {
      await API.delete(`/employees/${deleteEmployeeId}`);
      setToast({
        open: true,
        message: `Employee "${deleteEmployeeName}" successfully deleted.`,
        severity: 'success'
      });
      fetchEmployees();
    } catch (error) {
      setToast({
        open: true,
        message: error.message || 'Failed to delete employee.',
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
        onClick={() => navigate(`/employee/view/${row.UserID}`)}
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
        onClick={() => {
          setEditEmployeeId(row.UserID);
          setOpenFormDialog(true);
        }}
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
        onClick={() => handleOpenDeleteModal(row.UserID, row.FirstName, row.LastName)}
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
          <Typography variant="h4" sx={{ fontWeight: 800 }}>Employee Details</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={fetchEmployees} size="medium" color="default" sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <RefreshIcon />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditEmployeeId(null);
              setOpenFormDialog(true);
            }}
            sx={{ borderRadius: 2.5, px: 3, fontWeight: 700 }}
          >
            Add Employee
          </Button>
        </Box>
      </Box>

      {/* Advanced Reusable Table */}
      <AdvancedTable
        title="Employee Details"
        columns={columns}
        rows={employees}
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
        <DialogTitle sx={{ fontWeight: 800 }}>Confirm Delete Employee</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete the employee record for <b>"{deleteEmployeeName}"</b>?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setOpenDeleteModal(false)} variant="outlined" sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Button onClick={handleDeleteEmployee} color="error" variant="contained" sx={{ borderRadius: 2, px: 3 }}>
            Yes, Delete Employee
          </Button>
        </DialogActions>
      </Dialog>

      <EmployeeFormDialog 
        open={openFormDialog} 
        onClose={() => setOpenFormDialog(false)} 
        employeeId={editEmployeeId} 
        onSuccess={handleFormSuccess} 
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
