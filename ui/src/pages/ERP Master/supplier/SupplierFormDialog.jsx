import React, { useState, useEffect } from 'react';
import { 
  Box, Button, TextField, Grid, Dialog, DialogTitle, DialogContent, DialogActions, Typography,
  Card, CardContent, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

import API from '../../../services/api';
import { Loader, ToastNotification } from '../../../components/ReusableComponents';

export default function SupplierFormDialog({ open, onClose, supplierId, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [industries, setIndustries] = useState([]);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [formErrors, setFormErrors] = useState({});

  const initialSupplierForm = {
    Company_Name: '',
    IndustryID: '',
    Spoc_Name: '',
    Supplier_Description: '',
    address: {
      Email: '',
      Mobile: '',
      Tel: '',
      Web: '',
      Address1: '',
      Address2: '',
      City: '',
      Country: 'Singapore',
      Postal_Code: '',
      Fax1: '',
      SkypeID: '',
      Remarks: ''
    }
  };

  const [formData, setFormData] = useState(initialSupplierForm);

  useEffect(() => {
    if (open) {
      setFormErrors({});
      fetchIndustries();
      if (supplierId) {
        fetchSupplierDetails();
      } else {
        setFormData(initialSupplierForm);
      }
    }
  }, [open, supplierId]);

  const fetchIndustries = async () => {
    try {
      const response = await API.get('/suppliers/industries');
      setIndustries(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch industries:', error);
    }
  };

  const fetchSupplierDetails = async () => {
    setLoading(true);
    try {
      const response = await API.get(`/suppliers/${supplierId}`);
      const supplier = response.data.data;
      
      setFormData({
        SupplierID: supplier.SupplierID,
        SupplierDisplayID: supplier.SupplierDisplayID || '',
        Company_Name: supplier.Company_Name || '',
        IndustryID: supplier.IndustryID || '',
        Spoc_Name: supplier.Spoc_Name || '',
        Supplier_Description: supplier.Supplier_Description || '',
        address: {
          Email: supplier.Email || '',
          Mobile: supplier.Mobile || '',
          Tel: supplier.Tel || '',
          Web: supplier.Web || '',
          Address1: supplier.Address1 || '',
          Address2: supplier.Address2 || '',
          City: supplier.City || '',
          Country: supplier.Country || 'Singapore',
          Postal_Code: supplier.Postal_Code || '',
          Fax1: supplier.Fax1 || '',
          SkypeID: supplier.SkypeID || '',
          Remarks: supplier.Remarks || ''
        }
      });
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSaveSupplier = async (e) => {
    if (e) e.preventDefault();
    
    // Validations
    const errors = {};
    let isValid = true;

    if (!formData.Company_Name || !formData.Company_Name.trim()) {
      errors.Company_Name = 'Company Name is required.';
      isValid = false;
    } else if (formData.Company_Name.length > 150) {
      errors.Company_Name = 'Company Name cannot exceed 150 characters.';
      isValid = false;
    }

    if (!formData.Supplier_Description || !formData.Supplier_Description.trim()) {
      errors.Supplier_Description = 'Supplier Description is required.';
      isValid = false;
    }

    if (!formData.address.Email || !formData.address.Email.trim()) {
      errors.Email = 'Email is required.';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.address.Email)) {
      errors.Email = 'Please enter a valid email address.';
      isValid = false;
    }
    
    setFormErrors(errors);

    if (!isValid) {
      return;
    }

    setLoading(true);
    try {
      const payload = {
        Company_Name: formData.Company_Name.trim(),
        IndustryID: formData.IndustryID || null,
        Spoc_Name: formData.Spoc_Name.trim(),
        Supplier_Description: formData.Supplier_Description.trim(),
        address: formData.address
      };

      if (supplierId) {
        await API.put(`/suppliers/${supplierId}`, payload);
        setToast({ open: true, message: 'Supplier details updated successfully.', severity: 'success' });
      } else {
        await API.post('/suppliers', payload);
        setToast({ open: true, message: 'Supplier registered successfully.', severity: 'success' });
      }

      setTimeout(() => {
        setLoading(false);
        onSuccess();
      }, 800);

    } catch (error) {
      setToast({
        open: true,
        message: error.message || 'Failed to save supplier details.',
        severity: 'error'
      });
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="lg"
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
        {supplierId ? 'Edit Supplier' : 'Add New Supplier'}
      </DialogTitle>

      <DialogContent sx={{ p: 3, bgcolor: 'background.default' }}>
        <Loader open={loading} />
        
        <Grid container spacing={3}>
          {/* Left Column: Supplier Information */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ borderRadius: 2, borderColor: 'divider', boxShadow: 'none', height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 700, mb: 2.5 }}>
                  Supplier Information
                </Typography>
                
                <Grid container spacing={2.5}>
                  {supplierId && (
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Supplier Display ID"
                        value={formData.SupplierDisplayID || ''}
                        disabled
                      />
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Company Name"
                      name="Company_Name"
                      value={formData.Company_Name}
                      onChange={handleInputChange}
                      required
                      error={!!formErrors.Company_Name}
                      helperText={formErrors.Company_Name}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id="industry-label">Industry</InputLabel>
                      <Select
                        labelId="industry-label"
                        name="IndustryID"
                        value={formData.IndustryID}
                        label="Industry"
                        onChange={handleInputChange}
                      >
                        <MenuItem value=""><em>Select Industry</em></MenuItem>
                        {industries.map((ind) => (
                          <MenuItem key={ind.value} value={ind.value}>
                            {ind.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="SPOC Name"
                      name="Spoc_Name"
                      value={formData.Spoc_Name}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Supplier Description"
                      name="Supplier_Description"
                      value={formData.Supplier_Description}
                      onChange={handleInputChange}
                      required
                      error={!!formErrors.Supplier_Description}
                      helperText={formErrors.Supplier_Description}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column: Address Information */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ borderRadius: 2, borderColor: 'divider', boxShadow: 'none', height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 700, mb: 2.5 }}>
                  Address Information
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      name="address.Email"
                      type="email"
                      value={formData.address.Email}
                      onChange={handleInputChange}
                      required
                      error={!!formErrors.Email}
                      helperText={formErrors.Email}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Mobile Number"
                      name="address.Mobile"
                      value={formData.address.Mobile}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Telephone"
                      name="address.Tel"
                      value={formData.address.Tel}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Website URL"
                      name="address.Web"
                      value={formData.address.Web}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Fax Number"
                      name="address.Fax1"
                      value={formData.address.Fax1}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Skype ID"
                      name="address.SkypeID"
                      value={formData.address.SkypeID}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address Line 1"
                      name="address.Address1"
                      value={formData.address.Address1}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address Line 2"
                      name="address.Address2"
                      value={formData.address.Address2}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="City"
                      name="address.City"
                      value={formData.address.City}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Country"
                      name="address.Country"
                      value={formData.address.Country}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Postal Code"
                      name="address.Postal_Code"
                      value={formData.address.Postal_Code}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      label="Remarks"
                      name="address.Remarks"
                      value={formData.address.Remarks}
                      onChange={handleInputChange}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>
          Cancel
        </Button>
        <Button onClick={handleSaveSupplier} variant="contained" startIcon={<SaveIcon />} sx={{ borderRadius: 2, px: 3 }}>
          {supplierId ? 'Save Changes' : 'Save Supplier'}
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
