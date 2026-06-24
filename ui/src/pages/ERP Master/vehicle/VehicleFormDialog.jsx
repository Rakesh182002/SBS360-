import React, { useState, useEffect } from 'react';
import { 
  Box, Button, TextField, Grid, Dialog, DialogTitle, DialogContent, DialogActions, Typography,
  Card, CardContent, IconButton
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import API from '../../../services/api';
import { Loader, ToastNotification } from '../../../components/ReusableComponents';

const dateInputStyle = {
  '& input[type="date"]': {
    position: 'relative',
    cursor: 'pointer',
    color: 'text.primary',
    '&::-webkit-calendar-picker-indicator': {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
      opacity: 0,
      cursor: 'pointer',
      zIndex: 1
    }
  }
};

const formatDateForInput = (dateVal) => {
  if (!dateVal) return '';
  const dateStr = String(dateVal).trim();
  if (dateStr === '' || dateStr === 'null') return '';
  
  if (dateStr.includes('T')) {
    return dateStr.split('T')[0];
  }
  
  const ymdMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (ymdMatch) {
    return ymdMatch[0];
  }
  
  const dmyMatch = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
  if (dmyMatch) {
    return `${dmyMatch[3]}-${dmyMatch[2]}-${dmyMatch[1]}`;
  }

  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toISOString().split('T')[0];
    }
  } catch (e) {
    // Ignore and fallback
  }
  return dateStr;
};

const dateFields = [
  'COE_Issue_Date', 'COE_Expiry_Date', 
  'RoadTax_Issue_Date', 'RoadTax_Expiry_Date', 
  'Insurance_Issue_Date', 'Insurance_Expiry_Date', 
  'Vehicle_Inspection_Date', 'Inspection_Due_Date'
];

export default function VehicleFormDialog({ open, onClose, vehicleId, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [formErrors, setFormErrors] = useState({});

  const initialVehicleForm = {
    Vehicle_Name: '',
    Vehicle_Type: '',
    Vehicle_Company: '',
    Vehicle_Model: '',
    Vehicle_Number: '',
    COE_Regn_Number: '',
    COE_Issue_Date: '',
    COE_Expiry_Date: '',
    RoadTax_Regn_Number: '',
    RoadTax_Issue_Date: '',
    RoadTax_Expiry_Date: '',
    Insurance_Company: '',
    Insurance_Policy_Number: '',
    Insurance_Issue_Date: '',
    Insurance_Expiry_Date: '',
    Vehicle_Inspection_Date: '',
    Inspection_Due_Date: '',
    AgreementNumber: '',
    Remarks: ''
  };

  const [formData, setFormData] = useState(initialVehicleForm);

  useEffect(() => {
    if (open) {
      setFormErrors({});
      if (vehicleId) {
        fetchVehicleDetails();
      } else {
        setFormData(initialVehicleForm);
      }
    }
  }, [open, vehicleId]);

  const fetchVehicleDetails = async () => {
    setLoading(true);
    try {
      const response = await API.get(`/transports/${vehicleId}`);
      const transport = response.data.data;
      
      const mappedForm = {
        Vehicle_Name: transport.Vehicle_Name || '',
        Vehicle_Type: transport.Vehicle_Type || '',
        Vehicle_Company: transport.Vehicle_Company || '',
        Vehicle_Model: transport.Vehicle_Model || '',
        Vehicle_Number: transport.Vehicle_Number || '',
        COE_Regn_Number: transport.COE_Regn_Number || '',
        RoadTax_Regn_Number: transport.RoadTax_Regn_Number || '',
        Insurance_Company: transport.Insurance_Company || '',
        Insurance_Policy_Number: transport.Insurance_Policy_Number || '',
        AgreementNumber: transport.AgreementNumber || '',
        Remarks: transport.Remarks || ''
      };

      // Format all date properties safely to YYYY-MM-DD
      for (const field of dateFields) {
        mappedForm[field] = formatDateForInput(transport[field]);
      }
      
      setFormData(mappedForm);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;
    if (name === 'Vehicle_Company') {
      finalValue = value.toUpperCase();
    }
    setFormData(prev => ({
      ...prev,
      [name]: finalValue
    }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.Vehicle_Name || !formData.Vehicle_Name.trim()) {
      errors.Vehicle_Name = 'Vehicle Name is required.';
      isValid = false;
    } else if (formData.Vehicle_Name.length > 50) {
      errors.Vehicle_Name = 'Vehicle Name cannot exceed 50 characters.';
      isValid = false;
    }

    if (!formData.Vehicle_Type || !formData.Vehicle_Type.trim()) {
      errors.Vehicle_Type = 'Vehicle Type is required.';
      isValid = false;
    } else if (formData.Vehicle_Type.length > 50) {
      errors.Vehicle_Type = 'Vehicle Type cannot exceed 50 characters.';
      isValid = false;
    }

    if (!formData.Vehicle_Number || !formData.Vehicle_Number.trim()) {
      errors.Vehicle_Number = 'Vehicle Number is required.';
      isValid = false;
    } else if (formData.Vehicle_Number.length > 50) {
      errors.Vehicle_Number = 'Vehicle Number cannot exceed 50 characters.';
      isValid = false;
    }

    if (formData.Vehicle_Company && formData.Vehicle_Company.length > 50) {
      errors.Vehicle_Company = 'Vehicle Company Name cannot exceed 50 characters.';
      isValid = false;
    }

    if (formData.Vehicle_Model && formData.Vehicle_Model.length > 50) {
      errors.Vehicle_Model = 'Model cannot exceed 50 characters.';
      isValid = false;
    }

    if (formData.COE_Regn_Number && formData.COE_Regn_Number.length > 100) {
      errors.COE_Regn_Number = 'COE Registration Number cannot exceed 100 characters.';
      isValid = false;
    }

    if (formData.RoadTax_Regn_Number && formData.RoadTax_Regn_Number.length > 100) {
      errors.RoadTax_Regn_Number = 'Road Tax Registration Number cannot exceed 100 characters.';
      isValid = false;
    }

    if (formData.Insurance_Policy_Number && formData.Insurance_Policy_Number.length > 100) {
      errors.Insurance_Policy_Number = 'Insurance Number cannot exceed 100 characters.';
      isValid = false;
    }

    if (formData.Insurance_Company && formData.Insurance_Company.length > 80) {
      errors.Insurance_Company = 'Insurance Company cannot exceed 80 characters.';
      isValid = false;
    }

    if (formData.AgreementNumber && formData.AgreementNumber.length > 150) {
      errors.AgreementNumber = 'Agreement Number cannot exceed 150 characters.';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSaveVehicle = async (e) => {
    if (e) e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Build request payload, converting empty date strings to null for backend safety
      const payload = { ...formData };
      for (const field of dateFields) {
        if (payload[field] === '') {
          payload[field] = null;
        }
      }

      if (vehicleId) {
        await API.put(`/transports/${vehicleId}`, payload);
        setToast({ open: true, message: 'Vehicle details updated successfully.', severity: 'success' });
      } else {
        await API.post('/transports', payload);
        setToast({ open: true, message: 'Vehicle registered successfully.', severity: 'success' });
      }

      setTimeout(() => {
        setLoading(false);
        onSuccess();
      }, 800);
    } catch (error) {
      setToast({
        open: true,
        message: error.message || 'Failed to save vehicle details.',
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
        py: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          {vehicleId ? 'Edit Vehicle Details' : 'Add New Vehicle'}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, bgcolor: 'background.default' }}>
        <Loader open={loading} />
        
        <Grid container spacing={3}>
          {/* Left Column: Vehicle Basic Information */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ borderRadius: 2, borderColor: 'divider', boxShadow: 'none', height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 700, mb: 2.5 }}>
                  Vehicle Information
                </Typography>
                
                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Vehicle Name"
                      name="Vehicle_Name"
                      value={formData.Vehicle_Name}
                      onChange={handleInputChange}
                      required
                      error={!!formErrors.Vehicle_Name}
                      helperText={formErrors.Vehicle_Name}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Vehicle Type"
                      name="Vehicle_Type"
                      value={formData.Vehicle_Type}
                      onChange={handleInputChange}
                      required
                      error={!!formErrors.Vehicle_Type}
                      helperText={formErrors.Vehicle_Type}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Vehicle Company Name"
                      name="Vehicle_Company"
                      value={formData.Vehicle_Company}
                      onChange={handleInputChange}
                      error={!!formErrors.Vehicle_Company}
                      helperText={formErrors.Vehicle_Company}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Model"
                      name="Vehicle_Model"
                      value={formData.Vehicle_Model}
                      onChange={handleInputChange}
                      error={!!formErrors.Vehicle_Model}
                      helperText={formErrors.Vehicle_Model}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Vehicle Number"
                      name="Vehicle_Number"
                      value={formData.Vehicle_Number}
                      onChange={handleInputChange}
                      required
                      error={!!formErrors.Vehicle_Number}
                      helperText={formErrors.Vehicle_Number}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Agreement Number"
                      name="AgreementNumber"
                      value={formData.AgreementNumber}
                      onChange={handleInputChange}
                      error={!!formErrors.AgreementNumber}
                      helperText={formErrors.AgreementNumber}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Remarks"
                      name="Remarks"
                      value={formData.Remarks}
                      onChange={handleInputChange}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column: COE, Road Tax, Insurance & Inspections */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ borderRadius: 2, borderColor: 'divider', boxShadow: 'none', height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 700, mb: 2.5 }}>
                  Registration & Compliance
                </Typography>
                
                <Grid container spacing={2}>
                  {/* COE Section */}
                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary', borderBottom: '1px solid', borderColor: 'divider', pb: 0.5, mb: 1 }}>
                      COE Details
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="COE Registration No"
                      name="COE_Regn_Number"
                      value={formData.COE_Regn_Number}
                      onChange={handleInputChange}
                      error={!!formErrors.COE_Regn_Number}
                      helperText={formErrors.COE_Regn_Number}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="COE Issue Date"
                      name="COE_Issue_Date"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      sx={dateInputStyle}
                      InputProps={{
                        endAdornment: <CalendarMonthIcon sx={{ color: 'text.secondary', fontSize: '1rem', pointerEvents: 'none' }} />
                      }}
                      value={formData.COE_Issue_Date}
                      onChange={handleInputChange}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="COE Expiry Date"
                      name="COE_Expiry_Date"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      sx={dateInputStyle}
                      InputProps={{
                        endAdornment: <CalendarMonthIcon sx={{ color: 'text.secondary', fontSize: '1rem', pointerEvents: 'none' }} />
                      }}
                      value={formData.COE_Expiry_Date}
                      onChange={handleInputChange}
                      size="small"
                    />
                  </Grid>

                  {/* Road Tax Section */}
                  <Grid item xs={12} sx={{ mt: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary', borderBottom: '1px solid', borderColor: 'divider', pb: 0.5, mb: 1 }}>
                      Road Tax Details
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Road Tax Regn No"
                      name="RoadTax_Regn_Number"
                      value={formData.RoadTax_Regn_Number}
                      onChange={handleInputChange}
                      error={!!formErrors.RoadTax_Regn_Number}
                      helperText={formErrors.RoadTax_Regn_Number}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Road Tax Issue Date"
                      name="RoadTax_Issue_Date"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      sx={dateInputStyle}
                      InputProps={{
                        endAdornment: <CalendarMonthIcon sx={{ color: 'text.secondary', fontSize: '1rem', pointerEvents: 'none' }} />
                      }}
                      value={formData.RoadTax_Issue_Date}
                      onChange={handleInputChange}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Road Tax Expiry Date"
                      name="RoadTax_Expiry_Date"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      sx={dateInputStyle}
                      InputProps={{
                        endAdornment: <CalendarMonthIcon sx={{ color: 'text.secondary', fontSize: '1rem', pointerEvents: 'none' }} />
                      }}
                      value={formData.RoadTax_Expiry_Date}
                      onChange={handleInputChange}
                      size="small"
                    />
                  </Grid>

                  {/* Insurance Section */}
                  <Grid item xs={12} sx={{ mt: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary', borderBottom: '1px solid', borderColor: 'divider', pb: 0.5, mb: 1 }}>
                      Insurance Details
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Insurance Company"
                      name="Insurance_Company"
                      value={formData.Insurance_Company}
                      onChange={handleInputChange}
                      error={!!formErrors.Insurance_Company}
                      helperText={formErrors.Insurance_Company}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Insurance Policy Number"
                      name="Insurance_Policy_Number"
                      value={formData.Insurance_Policy_Number}
                      onChange={handleInputChange}
                      error={!!formErrors.Insurance_Policy_Number}
                      helperText={formErrors.Insurance_Policy_Number}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Insurance Issue Date"
                      name="Insurance_Issue_Date"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      sx={dateInputStyle}
                      InputProps={{
                        endAdornment: <CalendarMonthIcon sx={{ color: 'text.secondary', fontSize: '1rem', pointerEvents: 'none' }} />
                      }}
                      value={formData.Insurance_Issue_Date}
                      onChange={handleInputChange}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Insurance Expiry Date"
                      name="Insurance_Expiry_Date"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      sx={dateInputStyle}
                      InputProps={{
                        endAdornment: <CalendarMonthIcon sx={{ color: 'text.secondary', fontSize: '1rem', pointerEvents: 'none' }} />
                      }}
                      value={formData.Insurance_Expiry_Date}
                      onChange={handleInputChange}
                      size="small"
                    />
                  </Grid>

                  {/* Inspection Section */}
                  <Grid item xs={12} sx={{ mt: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary', borderBottom: '1px solid', borderColor: 'divider', pb: 0.5, mb: 1 }}>
                      Inspection & Due Dates
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Inspection Date"
                      name="Vehicle_Inspection_Date"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      sx={dateInputStyle}
                      InputProps={{
                        endAdornment: <CalendarMonthIcon sx={{ color: 'text.secondary', fontSize: '1rem', pointerEvents: 'none' }} />
                      }}
                      value={formData.Vehicle_Inspection_Date}
                      onChange={handleInputChange}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Inspection Due Date"
                      name="Inspection_Due_Date"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      sx={dateInputStyle}
                      InputProps={{
                        endAdornment: <CalendarMonthIcon sx={{ color: 'text.secondary', fontSize: '1rem', pointerEvents: 'none' }} />
                      }}
                      value={formData.Inspection_Due_Date}
                      onChange={handleInputChange}
                      size="small"
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
        <Button onClick={handleSaveVehicle} variant="contained" startIcon={<SaveIcon />} sx={{ borderRadius: 2, px: 3 }}>
          {vehicleId ? 'Save Changes' : 'Save Vehicle'}
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
