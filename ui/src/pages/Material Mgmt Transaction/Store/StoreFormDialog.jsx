import React, { useState, useEffect } from 'react';
import { 
  Box, Button, TextField, Grid, Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

import API from '../../../services/api';
import { Loader, ToastNotification, FormInput, FormDatePicker } from '../../../components/ReusableComponents';

export default function StoreFormDialog({ open, onClose, storeId, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [formErrors, setFormErrors] = useState({});

  const initialFormState = {
    Store_Name: '',
    Store_Code: '',
    Branch_Name: '',
    Start_Date: '',
    Address1: '',
    Address2: '',
    City: '',
    Country: '',
    Store_Description: '',
    Incharge_Name: '',
    Remarks: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (open) {
      setFormErrors({});
      if (storeId) {
        fetchStoreDetails();
      } else {
        setFormData(initialFormState);
      }
    }
  }, [open, storeId]);

  const fetchStoreDetails = async () => {
    setLoading(true);
    try {
      const response = await API.get(`/material/stores/${storeId}`);
      const store = response.data.data;
      
      let formattedDate = '';
      if (store.Start_Date) {
        formattedDate = store.Start_Date.substring(0, 10);
      }

      setFormData({
        StoreID: store.StoreID,
        Store_Name: store.Store_Name || '',
        Store_Code: store.Store_Code || '',
        Branch_Name: store.Branch_Name || '',
        Start_Date: formattedDate,
        Address1: store.Address1 || '',
        Address2: store.Address2 || '',
        City: store.City || '',
        Country: store.Country || '',
        Store_Description: store.Store_Description || '',
        Incharge_Name: store.Incharge_Name || '',
        Remarks: store.Remarks || ''
      });
    } catch (error) {
      setToast({
        open: true,
        message: error.message || 'Failed to fetch store details.',
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

  const handleSaveStore = async (e) => {
    if (e) e.preventDefault();
    
    const errors = {};
    let isValid = true;

    if (!formData.Branch_Name) {
      errors.Branch_Name = 'Company Name is required.';
      isValid = false;
    }
    if (!formData.Store_Name || !formData.Store_Name.trim()) {
      errors.Store_Name = 'Store Name is required.';
      isValid = false;
    } else if (formData.Store_Name.length > 150) {
      errors.Store_Name = 'Store Name cannot exceed 150 characters.';
      isValid = false;
    }

    if (formData.Store_Code && formData.Store_Code.length > 50) {
      errors.Store_Code = 'Store Code cannot exceed 50 characters.';
      isValid = false;
    }

    if (formData.Branch_Name && formData.Branch_Name.length > 50) {
      errors.Branch_Name = 'Branch Name cannot exceed 50 characters.';
      isValid = false;
    }

    if (formData.Store_Description && formData.Store_Description.length > 250) {
      errors.Store_Description = 'Description cannot exceed 250 characters.';
      isValid = false;
    }

    if (formData.Incharge_Name && formData.Incharge_Name.length > 80) {
      errors.Incharge_Name = 'Incharge Name cannot exceed 80 characters.';
      isValid = false;
    }

    if (formData.Remarks && formData.Remarks.length > 250) {
      errors.Remarks = 'Remarks cannot exceed 250 characters.';
      isValid = false;
    }

    if (formData.Start_Date) {
      const todayStr = new Date().toLocaleDateString('en-CA');
      if (formData.Start_Date > todayStr) {
        errors.Start_Date = 'Start Date cannot be in the future.';
        isValid = false;
      }
    }

    if (!isValid) {
      setFormErrors(errors);
      return;
    }

    setLoading(true);
    try {
      if (storeId) {
        await API.put(`/material/stores/${storeId}`, formData);
        onSuccess('Store updated successfully.');
      } else {
        await API.post('/material/stores', formData);
        onSuccess('Store created successfully.');
      }
    } catch (error) {
      setToast({
        open: true,
        message: error.message || 'An error occurred while saving the store.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 24px 48px rgba(0,0,0,0.15)'
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, pb: 1, fontSize: '1.25rem' }}>
          {storeId ? 'Edit Store Details' : 'Add New Store'}
        </DialogTitle>
        
        <DialogContent dividers sx={{ p: 3 }}>
          <Box component="form" noValidate onSubmit={handleSaveStore}>
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="company-name-label" required error={!!formErrors.Branch_Name}
                    helperText={formErrors.Branch_Name}>Company Name</InputLabel>
                  <Select
                    labelId="company-name-label"
                    label="Company Name"
                    name="Branch_Name"
                    value={formData.Branch_Name}
                    onChange={handleInputChange}
                    error={!!formErrors.Branch_Name}
                  >
                    <MenuItem value="City Construction Eng Pte Ltd">City Construction Eng Pte Ltd</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

               <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Store Name"
                  name="Store_Name"
                  value={formData.Store_Name}
                  onChange={handleInputChange}
                  error={!!formErrors.Store_Name}
                  helperText={formErrors.Store_Name}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  rows={2}
                  label="Store Description"
                  name="Store_Description"
                  value={formData.Store_Description}
                  onChange={handleInputChange}
                  error={!!formErrors.Store_Description}
                  helperText={formErrors.Store_Description}
                />
              </Grid>


              <Grid item xs={12} sm={6}>
                <FormDatePicker
                  label="Start Date"
                  value={formData.Start_Date}
                  onChange={(val) => {
                    setFormData(prev => ({ ...prev, Start_Date: val }));
                    if (formErrors.Start_Date) {
                      setFormErrors(prev => ({ ...prev, Start_Date: '' }));
                    }
                  }}
                  maxDate={new Date().toLocaleDateString('en-CA')}
                  error={!!formErrors.Start_Date}
                  helperText={formErrors.Start_Date}
                  margin="none"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Address Line 1"
                  name="Address1"
                  value={formData.Address1}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Address Line 2"
                  name="Address2"
                  value={formData.Address2}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  name="City"
                  value={formData.City}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Country"
                  name="Country"
                  value={formData.Country}
                  onChange={handleInputChange}
                />
              </Grid>

                <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Incharge Name"
                  name="Incharge_Name"
                  value={formData.Incharge_Name}
                  onChange={handleInputChange}
                  error={!!formErrors.Incharge_Name}
                  helperText={formErrors.Incharge_Name}
                />
              </Grid>           

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Remarks"
                  name="Remarks"
                  value={formData.Remarks}
                  onChange={handleInputChange}
                  error={!!formErrors.Remarks}
                  helperText={formErrors.Remarks}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2.5 }}>
          <Button 
            onClick={onClose} 
            variant="outlined" 
            sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveStore} 
            variant="contained" 
            startIcon={<SaveIcon />}
            sx={{ borderRadius: 2, textTransform: 'none', px: 4 }}
          >
            Save Store
          </Button>
        </DialogActions>
      </Dialog>

      <ToastNotification
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast(prev => ({ ...prev, open: false }))}
      />
      <Loader open={loading} />
    </>
  );
}
