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
import ProductFormDialog from './ProductFormDialog';

export default function ProductDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [openFormDialog, setOpenFormDialog] = useState(false);

  const handleDialogSuccess = (msg) => {
    setOpenFormDialog(false);
    setToast({ open: true, message: msg, severity: 'success' });
    fetchProductDetails();
  };

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const response = await API.get(`/products/${id}`);
      setProduct(response.data.data);
    } catch (error) {
      setToast({
        open: true,
        message: error.message || 'Failed to fetch product details.',
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
          <Typography variant="h4" sx={{ fontWeight: 800 }}>Product Details</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant="outlined" 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate('/product')}
            sx={{ borderRadius: 2 }}
          >
            Back
          </Button>
          <Button 
            variant="contained" 
            startIcon={<EditIcon />} 
            onClick={() => setOpenFormDialog(true)}
            sx={{ borderRadius: 2 }}
          >
            Edit Details
          </Button>
        </Box>
      </Box>

      {product && (
        <Grid container spacing={3}>
          {/* General Product Details */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.01)' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 700, mb: 2 }}>General Info</Typography>
                <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, width: '25%', bgcolor: 'action.hover' }}>Product Name</TableCell>
                        <TableCell sx={{ width: '75%' }}>{product.Product_Name}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Product Code</TableCell>
                        <TableCell>{product.Product_Code || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Product Type</TableCell>
                        <TableCell>{product.Product_Type || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Company Name</TableCell>
                        <TableCell>{product.Product_Company_Name || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Product Description</TableCell>
                        <TableCell>{product.Product_Description || '-'}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Measurements & Pricing */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.01)' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 700, mb: 2 }}>Measurements & Pricing</Typography>
                <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, width: '25%', bgcolor: 'action.hover' }}>Dimension</TableCell>
                        <TableCell sx={{ width: '25%' }}>{product.Dimension || '-'}</TableCell>
                        <TableCell sx={{ fontWeight: 700, width: '25%', bgcolor: 'action.hover' }}>Unit of Measure</TableCell>
                        <TableCell sx={{ width: '25%' }}>{product.Measuring_Unit || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Unit Price</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: 'success.main' }}>
                          ${product.Unit_Price !== null ? parseFloat(product.Unit_Price).toFixed(2) : '0.00'}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Status</TableCell>
                        <TableCell>{product.IsActive === 1 ? 'Active' : 'Inactive'}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Barcode details */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.01)' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 700, mb: 2 }}>Barcode Configurations</Typography>
                <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, width: '25%', bgcolor: 'action.hover' }}>Barcode 1</TableCell>
                        <TableCell sx={{ width: '75%' }}>{product.Barcode1 || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Barcode 2</TableCell>
                        <TableCell>{product.Barcode2 || '-'}</TableCell>
                      </TableRow>
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

      <ProductFormDialog
        open={openFormDialog}
        onClose={() => setOpenFormDialog(false)}
        productId={id}
        onSuccess={handleDialogSuccess}
      />
    </Box>
  );
}
