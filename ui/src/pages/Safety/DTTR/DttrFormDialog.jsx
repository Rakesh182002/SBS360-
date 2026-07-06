import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  Box, Button, TextField, Grid, Dialog, DialogTitle, DialogContent, DialogActions, 
  Typography, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel,
  FormGroup, Divider, Paper
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

import API from '../../../services/api';
import { Loader, ToastNotification, FormDatePicker, FormTimePicker } from '../../../components/ReusableComponents';

const initialFormState = {
  CompanyName: 'CITI CONSTRUCTION  ENGINEERING PTE. LTD.',
  ProjectTitle: '',
  RepDate: new Date().toLocaleDateString('en-CA'),
  RepTime: '',
  LocationOfWork: '',
  OtherHazard: '',
  ASHMeasures: '',
  hazardList: [],
  ppeList: [],
  workerList: []
};

export default function DttrFormDialog({ open, onClose, safetyId, onSuccess }) {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState({});

  // Dropdowns lists
  const [projects, setProjects] = useState([]);
  const [hazards, setHazards] = useState([]);
  const [ppes, setPpes] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    if (open) {
      fetchDropdowns();
      if (safetyId) {
        fetchSafetyDetails();
      } else {
        setFormData({
          ...initialFormState,
          RepDate: new Date().toLocaleDateString('en-CA'),
          RepTime: new Date().toTimeString().substring(0, 5)
        });
        setFormErrors({});
      }
    }
  }, [open, safetyId]);

  const fetchDropdowns = async () => {
    try {
      const [resHazards, resPpes, resEmployees] = await Promise.all([
        API.get('/safety/hazards'),
        API.get('/safety/ppes'),
        API.get('/employees')
      ]);
      setHazards(resHazards.data.data || []);
      setPpes(resPpes.data.data || []);
      setEmployees(resEmployees.data.data || []);
      
      try {
        const resProj = await API.get('/safety/projects');
        setProjects(resProj.data.data || []);
      } catch (err) {
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

  const fetchSafetyDetails = async () => {
    setLoading(true);
    try {
      const response = await API.get(`/safety/${safetyId}`);
      const data = response.data.data;
      setFormData({
        CompanyName: data.CompanyName || 'CITI CONSTRUCTION  ENGINEERING PTE. LTD.',
        ProjectTitle: data.ProjectTitle || '',
        RepDate: data.RepDate ? data.RepDate.substring(0, 10) : new Date().toLocaleDateString('en-CA'),
        RepTime: data.RepTime ? data.RepTime.substring(0, 5) : '08:00',
        LocationOfWork: data.LocationOfWork || '',
        OtherHazard: data.OtherHazard || '',
        ASHMeasures: data.ASHMeasures || '',
        hazardList: data.hazardList || [],
        ppeList: data.ppeList || [],
        workerList: data.workerList ? data.workerList.map(w => w.UserID) : []
      });
    } catch (error) {
      setToast({ open: true, message: 'Failed to load safety record details.', severity: 'error' });
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

  const handleCheckboxChange = (listName, itemId) => {
    setFormData(prev => {
      const currentList = prev[listName];
      const newList = currentList.includes(itemId)
        ? currentList.filter(id => id !== itemId)
        : [...currentList, itemId];
      return { ...prev, [listName]: newList };
    });
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.ProjectTitle) {
      errors.ProjectTitle = 'Project is required.';
      isValid = false;
    }
    if (!formData.LocationOfWork || !formData.LocationOfWork.trim()) {
      errors.LocationOfWork = 'Location of work is required.';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      if (safetyId) {
        await API.put(`/safety/${safetyId}`, formData);
        onSuccess('Safety declaration updated successfully.');
      } else {
        await API.post('/safety', formData);
        onSuccess('Safety declaration created successfully.');
      }
    } catch (error) {
      setToast({
        open: true,
        message: error.response?.data?.message || error.message || 'Failed to save safety declaration.',
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
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, boxShadow: '0 24px 48px rgba(0,0,0,0.15)' }
      }}
    >
      <Loader open={loading} />
      <DialogTitle sx={{ fontWeight: 800, pb: 1, fontSize: '1.25rem' }}>
        {safetyId ? 'Edit DTTR' : 'Add New DTTR'}
      </DialogTitle>
      
      <DialogContent dividers sx={{ p: 3 }}>
        <Box component="form" noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Grid container spacing={2.5}>
          
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company Name"
                name="CompanyName"
                value={formData.CompanyName}
                onChange={handleInputChange}
                disabled
              />
            </Grid>

              <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!!formErrors.ProjectTitle}>
                <InputLabel id="project-label">Project</InputLabel>
                <Select
                  labelId="project-label"
                  label="Project"
                  name="ProjectTitle"
                  value={formData.ProjectTitle}
                  onChange={handleInputChange}
                >
                  {projects.map(p => (
                    <MenuItem key={p.ProjectID || p.ProjectName} value={p.ProjectName}>
                      {p.ProjectName}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.ProjectTitle && <Typography variant="caption" color="error">{formErrors.ProjectTitle}</Typography>}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormDatePicker
                required
                label="Report Date"
                value={formData.RepDate}
                onChange={(val) => setFormData(prev => ({ ...prev, RepDate: val }))}
                margin="none"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormTimePicker
                label="Report Time"
                value={formData.RepTime}
                onChange={(val) => setFormData(prev => ({ ...prev, RepTime: val }))}
                margin="none"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Location of Work"
                name="LocationOfWork"
                value={formData.LocationOfWork}
                onChange={handleInputChange}
                error={!!formErrors.LocationOfWork}
                helperText={formErrors.LocationOfWork}
              />
            </Grid>           

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Supervisor (Name / Designation)"
                value={user ? `${user.first_name} ${user.last_name || ''} / ${user.role || ''}` : ''}
                disabled
              />
            </Grid>

          </Grid>

          <Divider />

          {/* Hazards Checklist Section */}
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>List of Hazards associated & identified in today's task & its corresponding RA & SWP reminded (Check box)</Typography>
          <Paper variant="outlined" sx={{ p: 1, borderRadius: 1 }}>
            <FormGroup row sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 1 }}>
              {hazards.map(h => (
                <FormControlLabel
                  key={h.HazardID}
                  control={
                    <Checkbox 
                      checked={formData.hazardList.includes(h.HazardID)}
                      onChange={() => handleCheckboxChange('hazardList', h.HazardID)}
                    />
                  }
                  label={h.HazardDesc}
                />
              ))}
            </FormGroup>
          </Paper>


            <Grid item xs={12} sm={6}>
              <TextField
                // fullWidth
                label="Other Hazards Description"
                name="OtherHazard"
                value={formData.OtherHazard}
                onChange={handleInputChange}
              />
            </Grid>

            
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                label="Additional Safety & Health Measures highlightd to comply, if any"
                name="ASHMeasures"
                value={formData.ASHMeasures}
                onChange={handleInputChange}
              />
            </Grid>

          {/* PPE Checklist Section */}
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>List of PPE highlighted and reminded to comply (Check box)</Typography>
          <Paper variant="outlined" sx={{ p: 1, borderRadius: 1 }}>
            <FormGroup row sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 1 }}>
              {ppes.map(p => (
                <FormControlLabel
                  key={p.PPEID}
                  control={
                    <Checkbox 
                      checked={formData.ppeList.includes(p.PPEID)}
                      onChange={() => handleCheckboxChange('ppeList', p.PPEID)}
                    />
                  }
                  label={p.PPE_Desc}
                />
              ))}
            </FormGroup>
          </Paper>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Acknowledgement and undertaking by employees attending this Toolbox Talk (Supervisor to highlight this)</Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 500,color:'blue' }}>We, the undersigned, herewith acknowledge that we have been already briefed on all necessary RA, SWP & MOS for the variuos activities and reminded to us today as above. We undertake to comply all ncessary Safety & Health measures.</Typography>
          {/* Workers Multi-Select */}
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Select the List of Workers (Check box)</Typography>
          <Paper variant="outlined" sx={{ p: 1, borderRadius: 1 }}>
            <FormGroup row sx={{ display: 'flex', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
              {employees.map(emp => (
                <FormControlLabel
                  key={emp.UserID}
                  control={
                    <Checkbox 
                      checked={formData.workerList.includes(emp.UserID)}
                      onChange={() => handleCheckboxChange('workerList', emp.UserID)}
                    />
                  }
                  label={`${emp.FirstName} ${emp.LastName || ''}`}
                />
              ))}
            </FormGroup>
          </Paper>
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
          Save Safety Form
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
