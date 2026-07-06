import React, { useState, useEffect } from 'react';
import { 
  Box, Button, TextField, Grid, Dialog, DialogTitle, DialogContent, DialogActions, Typography,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

import API from '../../../services/api';
import { Loader, ToastNotification } from '../../../components/ReusableComponents';

const UOM_OPTIONS = [
  { value: "mm", text: "mm" },
  { value: "cm", text: "cm" },
  { value: "meter", text: "meter" },
  { value: "sq.m", text: "sq.m" },
  { value: "Nos", text: "nos" },
  { value: "ltrs", text: "ltrs" },
  { value: "lot", text: "lot" },
  { value: "kg", text: "kg" },
  { value: "Pallet", text: "pallet" },
  { value: "Ton", text: "ton" },
  { value: "Bundle", text: "bundle" },
  { value: "Dozen", text: "dozon" },
  { value: "Tin", text: "Tin" },
  { value: "Box", text: "Box" },
  { value: "Lumpsum", text: "Lumpsum" },
  { value: "cu.m", text: "cu.m" },
  { value: "hr", text: "hr" },
  { value: "day", text: "day" },
  { value: "week", text: "week" },
  { value: "Pack", text: "pack" }
];

export default function ProductFormDialog({ open, onClose, productId, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [formErrors, setFormErrors] = useState({});

  const initialProductForm = {
    Product_Name: '',
    Product_Type: '',
    Product_Company_Name: '',
    Product_Description: '',
    Dimension: '',
    Measuring_Unit: 'Nos',
    Unit_Price: '',
    Product_Code: '',
    Barcode1: '',
    Barcode2: ''
  };

  const [formData, setFormData] = useState(initialProductForm);

  useEffect(() => {
    if (open) {
      setFormErrors({});
      if (productId) {
        fetchProductDetails();
      } else {
        setFormData(initialProductForm);
      }
    }
  }, [open, productId]);

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const response = await API.get(`/products/${productId}`);
      const product = response.data.data;
      
      setFormData({
        ProductID: product.ProductID,
        Product_Name: product.Product_Name || '',
        Product_Type: product.Product_Type || '',
        Product_Company_Name: product.Product_Company_Name || '',
        Product_Description: product.Product_Description || '',
        Dimension: product.Dimension || '',
        Measuring_Unit: product.Measuring_Unit || 'Nos',
        Unit_Price: product.Unit_Price !== null ? String(product.Unit_Price) : '',
        Product_Code: product.Product_Code || '',
        Barcode1: product.Barcode1 || '',
        Barcode2: product.Barcode2 || ''
      });
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSaveProduct = async (e) => {
    if (e) e.preventDefault();
    
    // Validate
    const errors = {};
    let isValid = true;

    if (!formData.Product_Name || !formData.Product_Name.trim()) {
      errors.Product_Name = 'Product Name is required.';
      isValid = false;
    } else if (formData.Product_Name.length > 150) {
      errors.Product_Name = 'Product Name cannot exceed 150 characters.';
      isValid = false;
    }

    if (formData.Product_Type && formData.Product_Type.length > 100) {
      errors.Product_Type = 'Product Type cannot exceed 100 characters.';
      isValid = false;
    }

    if (formData.Product_Company_Name && formData.Product_Company_Name.length > 150) {
      errors.Product_Company_Name = 'Company Name cannot exceed 150 characters.';
      isValid = false;
    }

    if (formData.Product_Description && formData.Product_Description.length > 250) {
      errors.Product_Description = 'Description cannot exceed 250 characters.';
      isValid = false;
    }

    if (formData.Dimension && formData.Dimension.length > 50) {
      errors.Dimension = 'Dimension cannot exceed 50 characters.';
      isValid = false;
    }

    if (!formData.Unit_Price || isNaN(formData.Unit_Price) || parseFloat(formData.Unit_Price) < 0) {
      errors.Unit_Price = 'Please enter a valid positive unit price.';
      isValid = false;
    }

    if (formData.Barcode1 && formData.Barcode1.length > 250) {
      errors.Barcode1 = 'Barcode1 cannot exceed 250 characters.';
      isValid = false;
    }

    if (formData.Barcode2 && formData.Barcode2.length > 250) {
      errors.Barcode2 = 'Barcode2 cannot exceed 250 characters.';
      isValid = false;
    }

    setFormErrors(errors);

    if (!isValid) {
      return;
    }

    setLoading(true);
    try {
      const payload = {
        Product_Name: formData.Product_Name.trim(),
        Product_Type: formData.Product_Type ? formData.Product_Type.trim() : null,
        Product_Company_Name: formData.Product_Company_Name ? formData.Product_Company_Name.trim() : null,
        Product_Description: formData.Product_Description ? formData.Product_Description.trim() : null,
        Dimension: formData.Dimension ? formData.Dimension.trim() : null,
        Measuring_Unit: formData.Measuring_Unit,
        Unit_Price: parseFloat(formData.Unit_Price),
        Barcode1: formData.Barcode1 ? formData.Barcode1.trim() : null,
        Barcode2: formData.Barcode2 ? formData.Barcode2.trim() : null
      };

      if (productId) {
        await API.put(`/products/${productId}`, payload);
        setToast({ open: true, message: 'Product updated successfully.', severity: 'success' });
      } else {
        await API.post('/products', payload);
        setToast({ open: true, message: 'Product created successfully.', severity: 'success' });
      }

      setTimeout(() => {
        setLoading(false);
        onSuccess(productId ? 'Product updated successfully.' : 'Product created successfully.');
      }, 800);

    } catch (error) {
      setToast({
        open: true,
        message: error.message || 'Failed to save product details.',
        severity: 'error'
      });
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ 
        fontWeight: 800, 
        borderBottom: '1px solid', 
        borderColor: 'divider',
        bgcolor: 'action.hover',
        px: 3,
        py: 2
      }}>
        {productId ? 'Edit Product Details' : 'Add New Product'}
      </DialogTitle>

      <DialogContent sx={{ p: 3, bgcolor: 'background.default' }}>
        <Loader open={loading} />
        
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            {productId && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Product Code"
                  name="Product_Code"
                  value={formData.Product_Code}
                  InputProps={{ readOnly: true }}
                  disabled
                />
              </Grid>
            )}
            <Grid item xs={12} sm={productId ? 6 : 12}>
              <TextField
                fullWidth
                required
                label="Product Name"
                name="Product_Name"
                value={formData.Product_Name}
                onChange={handleInputChange}
                error={!!formErrors.Product_Name}
                helperText={formErrors.Product_Name}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Product Type"
                name="Product_Type"
                value={formData.Product_Type}
                onChange={handleInputChange}
                error={!!formErrors.Product_Type}
                helperText={formErrors.Product_Type}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company Name"
                name="Product_Company_Name"
                value={formData.Product_Company_Name}
                onChange={handleInputChange}
                error={!!formErrors.Product_Company_Name}
                helperText={formErrors.Product_Company_Name}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Product Description"
                name="Product_Description"
                value={formData.Product_Description}
                onChange={handleInputChange}
                error={!!formErrors.Product_Description}
                helperText={formErrors.Product_Description}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Dimension"
                name="Dimension"
                value={formData.Dimension}
                onChange={handleInputChange}
                error={!!formErrors.Dimension}
                helperText={formErrors.Dimension}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="measuring-unit-label">Unit of Measure</InputLabel>
                <Select
                  labelId="measuring-unit-label"
                  name="Measuring_Unit"
                  value={formData.Measuring_Unit}
                  label="Unit of Measure"
                  onChange={handleInputChange}
                >
                  {UOM_OPTIONS.map(opt => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.text}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Unit Price"
                name="Unit_Price"
                type="number"
                value={formData.Unit_Price}
                onChange={handleInputChange}
                error={!!formErrors.Unit_Price}
                helperText={formErrors.Unit_Price}
                inputProps={{ min: "0", step: "0.01" }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Barcode 1"
                name="Barcode1"
                value={formData.Barcode1}
                onChange={handleInputChange}
                error={!!formErrors.Barcode1}
                helperText={formErrors.Barcode1}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Barcode 2"
                name="Barcode2"
                value={formData.Barcode2}
                onChange={handleInputChange}
                error={!!formErrors.Barcode2}
                helperText={formErrors.Barcode2}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>
          Cancel
        </Button>
        <Button onClick={handleSaveProduct} variant="contained" startIcon={<SaveIcon />} sx={{ borderRadius: 2, px: 3 }}>
          {productId ? 'Save Changes' : 'Save Product'}
        </Button>
      </DialogActions>

      <ToastNotification 
        open={toast.open} 
        message={toast.message} 
        severity={toast.severity} 
        onClose={() => setToast({ ...toast, open: false })} 
      />
    </Dialog>
  );
}
