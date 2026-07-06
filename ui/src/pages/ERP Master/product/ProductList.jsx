import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, 
  IconButton, Grid, Card, CardContent, TextField
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';

import API from '../../../services/api';
import { Loader, ToastNotification, AdvancedTable } from '../../../components/ReusableComponents';
import ProductFormDialog from './ProductFormDialog';

export default function ProductList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Toast notifications
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  
  // Delete modal state
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [deleteProductName, setDeleteProductName] = useState('');

  // Form dialog state
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);



  // Table Column Definitions
  const columns = [
    { id: 'Product_Name', label: 'Product Name', sortable: true },
    { id: 'Product_Company_Name', label: 'Company Name', sortable: true },
    { id: 'Product_Description', label: 'Description', sortable: true },
    { 
      id: 'Unit_Price', 
      label: 'Unit Price', 
      sortable: true,
      render: (val) => val !== null ? `$${parseFloat(val).toFixed(2)}` : '$0.00'
    }
  ];

  // Load products list on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await API.get('/products');
      setProducts(response.data.data || []);
    } catch (error) {
      setToast({
        open: true,
        message: error.message || 'Failed to fetch products.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddDialog = () => {
    setSelectedProductId(null);
    setOpenFormDialog(true);
  };

  const handleOpenEditDialog = (productId) => {
    setSelectedProductId(productId);
    setOpenFormDialog(true);
  };

  const handleFormSuccess = (msg) => {
    setOpenFormDialog(false);
    setToast({ open: true, message: msg, severity: 'success' });
    fetchProducts();
  };

  const handleOpenDeleteModal = (productId, productName) => {
    setDeleteProductId(productId);
    setDeleteProductName(productName);
    setOpenDeleteModal(true);
  };

  const handleDeleteProduct = async () => {
    setLoading(true);
    setOpenDeleteModal(false);
    try {
      await API.delete(`/products/${deleteProductId}`);
      setToast({
        open: true,
        message: `Product "${deleteProductName}" successfully deleted.`,
        severity: 'success'
      });
      fetchProducts();
    } catch (error) {
      setToast({
        open: true,
        message: error.message || 'Failed to delete product.',
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
        onClick={() => navigate(`/product/view/${row.ProductID}`)}
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
          transition: 'all 0.2s'
        }}
      >
        <VisibilityIcon fontSize="small" />
      </IconButton>
      <IconButton 
        size="small" 
        onClick={() => handleOpenEditDialog(row.ProductID)}
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
          transition: 'all 0.2s'
        }}
      >
        <EditIcon fontSize="small" />
      </IconButton>
      <IconButton 
        size="small" 
        onClick={() => handleOpenDeleteModal(row.ProductID, row.Product_Name)}
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
          transition: 'all 0.2s'
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
          <Typography variant="h4" sx={{ fontWeight: 800 }}>Product Details</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={fetchProducts} size="medium" color="default" sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <RefreshIcon />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAddDialog}
            sx={{ borderRadius: 2.5, px: 3, fontWeight: 700 }}
          >
            Add Product
          </Button>
        </Box>
      </Box>



      {/* Advanced Reusable Table */}
      <AdvancedTable
        title="Product Catalog"
        columns={columns}
        rows={products}
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
        <DialogTitle sx={{ fontWeight: 800 }}>Confirm Delete Product</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete the product <b>"{deleteProductName}"</b>?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setOpenDeleteModal(false)} variant="outlined" sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Button onClick={handleDeleteProduct} color="error" variant="contained" sx={{ borderRadius: 2, px: 3 }}>
            Yes, Delete Product
          </Button>
        </DialogActions>
      </Dialog>

      <ToastNotification 
        open={toast.open} 
        message={toast.message} 
        severity={toast.severity} 
        onClose={() => setToast({ ...toast, open: false })} 
      />

      <ProductFormDialog
        open={openFormDialog}
        onClose={() => setOpenFormDialog(false)}
        productId={selectedProductId}
        onSuccess={handleFormSuccess}
      />
    </Box>
  );
}
