import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Box, Card, CardContent, Typography, Button, 
  Grid, TableContainer, Table, TableRow, TableCell, 
  TableBody, Paper
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';

import API from '../../../services/api';
import { Loader, ToastNotification } from '../../../components/ReusableComponents';
import VehicleFormDialog from './VehicleFormDialog';

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      // Return DD/MM/YYYY
      return d.toLocaleDateString('en-GB');
    }
  } catch (e) {
    // Ignore and fallback
  }
  return dateStr;
};

export default function VehicleDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [vehicle, setVehicle] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [openVehicleDialog, setOpenVehicleDialog] = useState(false);

  useEffect(() => {
    fetchVehicleDetails();
  }, [id]);

  const fetchVehicleDetails = async () => {
    setLoading(true);
    try {
      const response = await API.get(`/transports/${id}`);
      setVehicle(response.data.data);
    } catch (error) {
      setToast({
        open: true,
        message: error.message || 'Failed to fetch vehicle details.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDialogSuccess = () => {
    setOpenVehicleDialog(false);
    fetchVehicleDetails();
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Loader open={loading} />

      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>Vehicle Details</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant="outlined" 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate('/vehicle')}
            sx={{ borderRadius: 2 }}
          >
            Back
          </Button>
          <Button 
            variant="contained" 
            startIcon={<EditIcon />} 
            onClick={() => setOpenVehicleDialog(true)}
            sx={{ borderRadius: 2 }}
          >
            Edit Profile
          </Button>
        </Box>
      </Box>

      {vehicle && (
        <Grid container spacing={3}>
          {/* Left Column: Vehicle Basic Profile & Remarks */}
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.01)', height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 700, mb: 2 }}>Vehicle Profile</Typography>
                <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, width: '35%', bgcolor: 'action.hover' }}>Vehicle Name</TableCell>
                        <TableCell>{vehicle.Vehicle_Name || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Vehicle Number</TableCell>
                        <TableCell>{vehicle.Vehicle_Number || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Vehicle Type</TableCell>
                        <TableCell>{vehicle.Vehicle_Type || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Company Name</TableCell>
                        <TableCell>{vehicle.Vehicle_Company || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Vehicle Model</TableCell>
                        <TableCell>{vehicle.Vehicle_Model || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Agreement Number</TableCell>
                        <TableCell>{vehicle.AgreementNumber || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Remarks</TableCell>
                        <TableCell sx={{ whiteSpace: 'pre-wrap' }}>{vehicle.Remarks || '-'}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

                <Typography variant="h6" color="primary" sx={{ fontWeight: 700, mt: 3, mb: 2 }}>Metadata</Typography>
                <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, width: '35%', bgcolor: 'action.hover' }}>Created Date</TableCell>
                        <TableCell>{vehicle.CreatedDate ? formatDate(vehicle.CreatedDate) : '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Created By (User ID)</TableCell>
                        <TableCell>{vehicle.CreatedBy || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Updated Date</TableCell>
                        <TableCell>{vehicle.UpdatedDate ? formatDate(vehicle.UpdatedDate) : '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Updated By (User ID)</TableCell>
                        <TableCell>{vehicle.UpdatedBy || '-'}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column: COE, Road Tax, Insurance & Inspections */}
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.01)', height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                {/* COE Section */}
                <Typography variant="h6" color="primary" sx={{ fontWeight: 700, mb: 2 }}>COE Details</Typography>
                <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, mb: 3 }}>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, width: '35%', bgcolor: 'action.hover' }}>COE Regn Number</TableCell>
                        <TableCell>{vehicle.COE_Regn_Number || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>COE Issue Date</TableCell>
                        <TableCell>{formatDate(vehicle.COE_Issue_Date)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>COE Expiry Date</TableCell>
                        <TableCell>{formatDate(vehicle.COE_Expiry_Date)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Road Tax Section */}
                <Typography variant="h6" color="primary" sx={{ fontWeight: 700, mb: 2 }}>Road Tax Details</Typography>
                <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, mb: 3 }}>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, width: '35%', bgcolor: 'action.hover' }}>Road Tax Regn Number</TableCell>
                        <TableCell>{vehicle.RoadTax_Regn_Number || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Road Tax Issue Date</TableCell>
                        <TableCell>{formatDate(vehicle.RoadTax_Issue_Date)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Road Tax Expiry Date</TableCell>
                        <TableCell>{formatDate(vehicle.RoadTax_Expiry_Date)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Insurance Section */}
                <Typography variant="h6" color="primary" sx={{ fontWeight: 700, mb: 2 }}>Insurance Details</Typography>
                <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, mb: 3 }}>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, width: '35%', bgcolor: 'action.hover' }}>Insurance Company</TableCell>
                        <TableCell>{vehicle.Insurance_Company || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Policy Number</TableCell>
                        <TableCell>{vehicle.Insurance_Policy_Number || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Insurance Issue Date</TableCell>
                        <TableCell>{formatDate(vehicle.Insurance_Issue_Date)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Insurance Expiry Date</TableCell>
                        <TableCell>{formatDate(vehicle.Insurance_Expiry_Date)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Inspections Section */}
                <Typography variant="h6" color="primary" sx={{ fontWeight: 700, mb: 2 }}>Inspection Details</Typography>
                <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, width: '35%', bgcolor: 'action.hover' }}>Inspection Date</TableCell>
                        <TableCell>{formatDate(vehicle.Vehicle_Inspection_Date)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Inspection Due Date</TableCell>
                        <TableCell>{formatDate(vehicle.Inspection_Due_Date)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <VehicleFormDialog
        open={openVehicleDialog}
        onClose={() => setOpenVehicleDialog(false)}
        vehicleId={id}
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
