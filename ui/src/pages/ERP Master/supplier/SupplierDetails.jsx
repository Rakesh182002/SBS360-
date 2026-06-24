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
import SupplierFormDialog from './SupplierFormDialog';

export default function SupplierDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [supplier, setSupplier] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [openSupplierDialog, setOpenSupplierDialog] = useState(false);

  useEffect(() => {
    fetchSupplierDetails();
  }, [id]);

  const fetchSupplierDetails = async () => {
    setLoading(true);
    try {
      const response = await API.get(`/suppliers/${id}`);
      setSupplier(response.data.data);
    } catch (error) {
      setToast({
        open: true,
        message: error.message || 'Failed to fetch supplier details.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDialogSuccess = () => {
    setOpenSupplierDialog(false);
    fetchSupplierDetails();
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Loader open={loading} />

      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>Supplier Details</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant="outlined" 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate('/supplier')}
            sx={{ borderRadius: 2 }}
          >
            Back
          </Button>
          <Button 
            variant="contained" 
            startIcon={<EditIcon />} 
            onClick={() => setOpenSupplierDialog(true)}
            sx={{ borderRadius: 2 }}
          >
            Edit Profile
          </Button>
        </Box>
      </Box>

      {supplier && (
        <Grid container spacing={3}>
          {/* Supplier Info */}
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.01)', height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 700, mb: 2 }}>Supplier Info</Typography>
                <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, width: '35%', bgcolor: 'action.hover' }}>Company Name</TableCell>
                        <TableCell>{supplier.Company_Name}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Supplier ID / Display ID</TableCell>
                        <TableCell>{supplier.SupplierDisplayID}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>SPOC Name</TableCell>
                        <TableCell>{supplier.Spoc_Name || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Supplier Description</TableCell>
                        <TableCell>{supplier.Supplier_Description || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Industry ID</TableCell>
                        <TableCell>{supplier.IndustryID || '-'}</TableCell>
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
                        <TableCell>{supplier.CreatedDate ? new Date(supplier.CreatedDate).toLocaleDateString() : '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Created By (User ID)</TableCell>
                        <TableCell>{supplier.CreatedBy || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Updated Date</TableCell>
                        <TableCell>{supplier.UpdatedDate ? new Date(supplier.UpdatedDate).toLocaleDateString() : '-'}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Registered Address */}
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.01)', height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 700, mb: 2 }}>Registered Office Address</Typography>
                <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, width: '35%', bgcolor: 'action.hover' }}>Address Line 1</TableCell>
                        <TableCell>{supplier.Address1 || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Address Line 2</TableCell>
                        <TableCell>{supplier.Address2 || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>City</TableCell>
                        <TableCell>{supplier.City || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Postal Code</TableCell>
                        <TableCell>{supplier.Postal_Code || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Country</TableCell>
                        <TableCell>{supplier.Country || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Primary Email</TableCell>
                        <TableCell>{supplier.Email || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Mobile Phone</TableCell>
                        <TableCell>{supplier.Mobile || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Tel Phone</TableCell>
                        <TableCell>{supplier.Tel || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Website</TableCell>
                        <TableCell>{supplier.Web || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Fax</TableCell>
                        <TableCell>{supplier.Fax1 || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Skype ID</TableCell>
                        <TableCell>{supplier.SkypeID || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Remarks</TableCell>
                        <TableCell>{supplier.AddressRemarks || '-'}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <SupplierFormDialog
        open={openSupplierDialog}
        onClose={() => setOpenSupplierDialog(false)}
        supplierId={id}
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
