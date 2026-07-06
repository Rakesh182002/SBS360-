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
import InwardFormDialog from './InwardFormDialog';

const RECEIPT_TYPE_MAP = {
  1: 'Purchase Order',
  2: 'Transfer Order',
  3: 'Return Order',
  4: 'Material Request',
  5: 'Miscellaneous'
};

export default function InwardDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [inward, setInward] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [openFormDialog, setOpenFormDialog] = useState(false);

  const handleDialogSuccess = (msg) => {
    setOpenFormDialog(false);
    setToast({ open: true, message: msg, severity: 'success' });
    fetchInwardDetails();
  };

  useEffect(() => {
    fetchInwardDetails();
  }, [id]);

  const fetchInwardDetails = async () => {
    setLoading(true);
    try {
      const response = await API.get(`/material/inwards/${id}`);
      setInward(response.data.data);
    } catch (error) {
      setToast({
        open: true,
        message: error.message || 'Failed to fetch inward details.',
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
          <Typography variant="h4" sx={{ fontWeight: 800 }}>Inward Receipt Details</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant="outlined" 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate('/inward')}
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
            Edit Receipt
          </Button> */}
        </Box>
      </Box>

      {inward && (
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
                            <TableCell sx={{ fontWeight: 700, width: '35%', bgcolor: 'action.hover' }}>Inward ID / No.</TableCell>
                            <TableCell sx={{ width: '65%' }}>{inward.Inward_Number || inward.Inward_ID}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Receipt Store</TableCell>
                            <TableCell>{inward.Store_Name}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Store Branch</TableCell>
                            <TableCell>{inward.Branch_Name || '-'}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Supplier</TableCell>
                            <TableCell>{inward.Supplier_Name || '-'}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Invoice/DO No.</TableCell>
                            <TableCell>{inward.Invoice_or_DO_Number || '-'}</TableCell>
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
                            <TableCell sx={{ fontWeight: 700, width: '35%', bgcolor: 'action.hover' }}>Invoice/DO Date</TableCell>
                            <TableCell sx={{ width: '65%' }}>{inward.Invoice_or_DO_Date ? new Date(inward.Invoice_or_DO_Date).toLocaleDateString() : '-'}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Receipt Type</TableCell>
                            <TableCell>{RECEIPT_TYPE_MAP[inward.Receipt_Type] || 'Others'}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Received Date</TableCell>
                            <TableCell>{inward.Received_Date ? new Date(inward.Received_Date).toLocaleDateString() : '-'}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Received By</TableCell>
                            <TableCell>{inward.Receiver_Name || '-'}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Status</TableCell>
                            <TableCell>
                              {inward.DraftFlag === 1 ? (
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
                      {inward.items && inward.items.map((item, idx) => (
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

      <InwardFormDialog
        open={openFormDialog}
        onClose={() => setOpenFormDialog(false)}
        inwardId={id}
        onSuccess={handleDialogSuccess}
      />
    </Box>
  );
}
