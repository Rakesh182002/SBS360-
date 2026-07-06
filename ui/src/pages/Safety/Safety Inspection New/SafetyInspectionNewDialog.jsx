import React, { useState, useEffect } from 'react';
import { 
  Box, Button, TextField, Grid, Dialog, DialogTitle, DialogContent, DialogActions, 
  Typography, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

import API from '../../../services/api';
import { Loader, ToastNotification, FormDatePicker } from '../../../components/ReusableComponents';

const initialFormState = {
  ProjectID: '',
  InspectionDate: new Date().toLocaleDateString('en-CA'),
  ProjectLocation: '',
  InspectedBy: '',
  Observation: '',
  RemedialAction: '',
  ActionBy_Deadline: '',
  Rectification_Remarks: '',
  Status: 'Pending',
  EHSName: '',
  AcknowlegeBy: '',
  fileName: '',
  fileData: '' // base64 string representation
};

export default function EhsFormDialog({ open, onClose, nsiId, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState({});

  // Dropdown lists
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    if (open) {
      fetchDropdowns();
      if (nsiId) {
        fetchEhsDetails();
      } else {
        setFormData(initialFormState);
        setFormErrors({});
      }
    }
  }, [open, nsiId]);

  const fetchDropdowns = async () => {
    try {
      const [resEmployees] = await Promise.all([
        API.get('/employees')
      ]);
      const employeeList = resEmployees.data.data || [];
      setEmployees(employeeList.filter(e => e.IsActive === 1 && e.GroupID === 2));
      
      try {
        const resProj = await API.get('/safety/projects');
        setProjects(resProj.data.data || []);
      } catch {
        setProjects([
          { ProjectID: 1, ProjectName: 'City Construction Main Office' },
          { ProjectID: 2, ProjectName: 'MRT Station Extension C102' },
          { ProjectID: 3, ProjectName: 'Tuas Warehouse Development' }
        ]);
      }
    } catch (error) {
      console.error('Failed to load dropdown sources:', error);
    }
  };

  const fetchEhsDetails = async () => {
    setLoading(true);
    try {
      const response = await API.get(`/safety/esh/${nsiId}`);
      const data = response.data.data;
      setFormData({
        ProjectID: data.ProjectID || '',
        InspectionDate: data.InspectionDate ? data.InspectionDate.substring(0, 10) : new Date().toLocaleDateString('en-CA'),
        ProjectLocation: data.ProjectLocation || '',
        InspectedBy: data.InspectedBy || '',
        Observation: data.Observation || '',
        RemedialAction: data.RemedialAction || '',
        ActionBy_Deadline: data.ActionBy_Deadline || '',
        Rectification_Remarks: data.Rectification_Remarks || '',
        Status: data.Status || 'Pending',
        EHSName: data.EHSName || '',
        AcknowlegeBy: data.AcknowlegeBy || '',
        fileName: data.FileName || '',
        fileData: ''
      });
    } catch (error) {
      setToast({ open: true, message: 'Failed to load EHS details.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          fileName: file.name,
          fileData: reader.result.split(',')[1] // extract raw base64 data
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.ProjectID) {
      errors.ProjectID = 'Project is required.';
      isValid = false;
    }
    if (!formData.InspectedBy) {
      errors.InspectedBy = 'Inspected By is required.';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      if (nsiId) {
        await API.put(`/safety/esh/${nsiId}`, formData);
        onSuccess('EHS audit report updated successfully.');
      } else {
        await API.post('/safety/esh', formData);
        onSuccess('EHS audit report created successfully.');
      }
    } catch (error) {
      setToast({
        open: true,
        message: error.response?.data?.message || error.message || 'Failed to save EHS audit report.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, boxShadow: '0 24px 48px rgba(0,0,0,0.15)' }
      }}
    >
      <Loader open={loading} />
      <DialogTitle sx={{ fontWeight: 800, pb: 1, fontSize: '1.25rem' }}>
        {nsiId ? 'Edit EHS Audit Report' : 'Add New EHS Audit Report'}
      </DialogTitle>
      
      <DialogContent dividers sx={{ p: 3 }}>
        <Box component="form" noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!!formErrors.ProjectID}>
                <InputLabel id="project-label">Project</InputLabel>
                <Select
                  labelId="project-label"
                  label="Project"
                  name="ProjectID"
                  value={formData.ProjectID}
                  onChange={handleInputChange}
                >
                  {projects.map(p => (
                    <MenuItem key={p.ProjectID} value={p.ProjectID}>
                      {p.ProjectName}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.ProjectID && <Typography variant="caption" color="error">{formErrors.ProjectID}</Typography>}
              </FormControl>
            </Grid>


            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Project Location"
                name="ProjectLocation"
                value={formData.ProjectLocation}
                onChange={handleInputChange}
              />
            </Grid>

            
            <Grid item xs={12} sm={6}>
              <FormDatePicker
                required
                label="Inspection Date"
                value={formData.InspectionDate}
                onChange={(val) => setFormData(prev => ({ ...prev, InspectionDate: val }))}
                margin="none"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!!formErrors.InspectedBy}>
                <InputLabel id="inspectedby-label">Inspected By</InputLabel>
                <Select
                  labelId="inspectedby-label"
                  label="Inspected By"
                  name="InspectedBy"
                  value={formData.InspectedBy}
                  onChange={handleInputChange}
                >
                  {employees.map(emp => (
                    <MenuItem key={emp.UserID} value={emp.UserID}>
                      {emp.FirstName} {emp.LastName || ''}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.InspectedBy && <Typography variant="caption" color="error">{formErrors.InspectedBy}</Typography>}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Observation details"
                name="Observation"
                value={formData.Observation}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Remedial Action"
                name="RemedialAction"
                value={formData.RemedialAction}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Action By / Deadline"
                name="ActionBy_Deadline"
                value={formData.ActionBy_Deadline}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Rectification Remarks"
                name="Rectification_Remarks"
                value={formData.Rectification_Remarks}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  label="Status"
                  name="Status"
                  value={formData.Status}
                  onChange={handleInputChange}
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
{/* 
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="EHS Officer Name"
                name="EHSName"
                value={formData.EHSName}
                onChange={handleInputChange}
              />
            </Grid> */}

            {/* <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Acknowledged By"
                name="AcknowlegeBy"
                value={formData.AcknowlegeBy}
                onChange={handleInputChange}
              />
            </Grid> */}

            <Grid item xs={12} sm={6}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>Attach Audit Image / File</Typography>
              <input type="file" accept="image/*,application/pdf" onChange={handleFileChange} />
              {formData.fileName && (
                <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: 'text.secondary' }}>
                  Selected File: {formData.fileName}
                </Typography>
              )}
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2, textTransform: 'none' }}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          startIcon={<SaveIcon />}
          sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}
        >
          Save Audit Report
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
