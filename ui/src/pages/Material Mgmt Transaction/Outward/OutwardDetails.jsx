import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Box, Card, CardContent, Typography, Button, Grid, 
  TableContainer, Table, TableRow, TableCell, TableBody, TableHead, Paper
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';

import API from '../../../services/api';
import { Loader, ToastNotification } from '../../../components/ReusableComponents';
import OutwardFormDialog from './OutwardFormDialog';

const OUTWARD_TYPE_MAP = {
  1: 'Delivery Order',
  2: 'Transfer Order',
  3: 'Return Order',
  4: 'Material Request',
  5: 'Miscellaneous'
};

export default function OutwardDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [outward, setOutward] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [openFormDialog, setOpenFormDialog] = useState(false);

  const handleDialogSuccess = (msg) => {
    setOpenFormDialog(false);
    setToast({ open: true, message: msg, severity: 'success' });
    fetchOutwardDetails();
  };

  useEffect(() => {
    fetchOutwardDetails();
  }, [id]);

  const fetchOutwardDetails = async () => {
    setLoading(true);
    try {
      const response = await API.get(`/material/outwards/${id}`);
      setOutward(response.data.data);
    } catch (error) {
      setToast({
        open: true,
        message: error.message || 'Failed to fetch outward details.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Loader open={loading} />

      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>Outward DO Details</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant="outlined" 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate('/outward')}
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Back
          </Button>
          {/* <Button 
            variant="contained" 
            startIcon={<EditIcon />} 
            onClick={() => setOpenFormDialog(true)}
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Edit DO
          </Button> */}
        </Box>
      </Box>

      {outward && (
        <Grid container spacing={3}>
          {/* General Metadata */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.01)' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 700, mb: 2 }}>General Info</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                      <Table size="small">
                        <TableBody>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 700, width: '35%', bgcolor: 'action.hover' }}>Outward ID / No.</TableCell>
                            <TableCell sx={{ width: '65%' }}>{outward.Outward_Number || outward.Outward_ID}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Dispatch Store</TableCell>
                            <TableCell>{outward.Store_Name}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Store Branch</TableCell>
                            <TableCell>{outward.Branch_Name || '-'}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Client Customer</TableCell>
                            <TableCell>{outward.Client_Name || '-'}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>DO Number</TableCell>
                            <TableCell>{outward.DO_Number || '-'}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>DO Date</TableCell>
                            <TableCell>{outward.DO_Date ? new Date(outward.DO_Date).toLocaleDateString() : '-'}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                      <Table size="small">
                        <TableBody>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 700, width: '35%', bgcolor: 'action.hover' }}>Outward Type</TableCell>
                            <TableCell sx={{ width: '65%' }}>{OUTWARD_TYPE_MAP[outward.Outward_Type] || 'Others'}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Delivery Date</TableCell>
                            <TableCell>{outward.Delivery_Date ? new Date(outward.Delivery_Date).toLocaleDateString() : '-'}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Vehicle Number</TableCell>
                            <TableCell>{outward.Vehicle_Number || '-'}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Delivery Mode</TableCell>
                            <TableCell>{outward.Delivery_Mode || '-'}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Project Location</TableCell>
                            <TableCell>{outward.Project_Location || '-'}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Delivered By</TableCell>
                            <TableCell>{outward.Deliverer_Name || '-'}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Status</TableCell>
                            <TableCell>
                              {outward.DraftFlag === 1 ? (
                                <Typography component="span" variant="body2" sx={{ bgcolor: 'success.main' + '20', color: 'success.main', px: 1.5, py: 0.5, borderRadius: 1.5, fontWeight: 600 }}>
                                  Confirmed
                                </Typography>
                              ) : (
                                <Typography component="span" variant="body2" sx={{ bgcolor: 'warning.main' + '20', color: 'warning.main', px: 1.5, py: 0.5, borderRadius: 1.5, fontWeight: 600 }}>
                                  Draft
                                </Typography>
                              )}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Description Items Details */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.01)' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 700, mb: 2 }}>Material Specifications List</Typography>
                <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                  <Table size="small">
                    <TableHead sx={{ bgcolor: 'action.hover' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, width: '25%' }}>Product Code</TableCell>
                        <TableCell sx={{ fontWeight: 700, width: '40%' }}>Product Name</TableCell>
                        <TableCell sx={{ fontWeight: 700, width: '15%' }}>Quantity</TableCell>
                        <TableCell sx={{ fontWeight: 700, width: '10%' }}>UoM</TableCell>
                        <TableCell sx={{ fontWeight: 700, width: '10%' }}>Remarks</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {outward.items && outward.items.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{item.Product_Code || '-'}</TableCell>
                          <TableCell>{item.Product_Name}</TableCell>
                          <TableCell>{item.Quantity}</TableCell>
                          <TableCell>{item.UoM}</TableCell>
                          <TableCell>{item.Remarks || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <ToastNotification 
        open={toast.open} 
        message={toast.message} 
        severity={toast.severity} 
        onClose={() => setToast({ ...toast, open: false })} 
      />

      <OutwardFormDialog
        open={openFormDialog}
        onClose={() => setOpenFormDialog(false)}
        outwardId={id}
        onSuccess={handleDialogSuccess}
      />
    </Box>
  );
}
