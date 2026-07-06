import React, { useState, useEffect } from 'react';
import { 
  Box, Button, TextField, Grid, Typography, Divider, Paper,
  FormControl, InputLabel, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Radio, RadioGroup, FormControlLabel
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

import API from '../../../services/api';
import { Loader, ToastNotification, FormDatePicker } from '../../../components/ReusableComponents';

export default function SafetyInspectionForm({ open, onClose, safetyInspectionId, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  // Dropdown options
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [checklistItems, setChecklistItems] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    SafetyRefNum: '',
    ProjectID: '',
    SIDate: new Date().toLocaleDateString('en-CA'),
    ProjectLocation: '',
    InspectedBy: '',
    Address: '',
    Safety_Cert_Info: '',
    Senior_Construction_Manager: '',
    Project_Manager: '',
    Site_Manager: '',
    Zone_Construction_Manager: '',
    Safety_Manager: '',
    Safety_Officer: '',
    details: [] // Checklist responses
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (open) {
      fetchDropdownsAndItems();
    }
  }, [open, safetyInspectionId]);

  const fetchDropdownsAndItems = async () => {
    setLoading(true);
    try {
      const [resEmployees, resItems] = await Promise.all([
        API.get('/employees'),
        API.get('/safety/inspection-items')
      ]);
      setEmployees(resEmployees.data.data || []);
      setChecklistItems(resItems.data.data || []);

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

      if (safetyInspectionId) {
        fetchInspectionDetails(safetyInspectionId, resItems.data.data);
      } else {
        // Initialize new form details array
        const initialDetails = (resItems.data.data || []).map(item => ({
          SIItemID: item.SIItemID,
          SIItemDesc: item.SIItemDesc,
          SectionName: item.SectionName,
          Is_Applicable: 4, // Default to N/A
          Recommendation: '',
          ResponsiblePerson: '',
          ACDate: new Date().toLocaleDateString('en-CA')
        }));
        setFormData({
          SafetyRefNum: '',
          ProjectID: '',
          SIDate: new Date().toLocaleDateString('en-CA'),
          ProjectLocation: '',
          InspectedBy: '',
          Address: '',
          Safety_Cert_Info: '',
          Senior_Construction_Manager: '',
          Project_Manager: '',
          Site_Manager: '',
          Zone_Construction_Manager: '',
          Safety_Manager: '',
          Safety_Officer: '',
          details: initialDetails
        });
        setFormErrors({});
      }
    } catch (error) {
      setToast({ open: true, message: 'Failed to load dropdown sources.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchInspectionDetails = async (insId, rawItems) => {
    setLoading(true);
    try {
      const response = await API.get(`/safety/inspections/${insId}`);
      const data = response.data.data;

      // Map loaded details or merge with raw items in case they are missing
      const mappedDetails = rawItems.map(raw => {
        const existing = data.details?.find(d => d.SIItemID === raw.SIItemID);
        return {
          SIItemID: raw.SIItemID,
          SIItemDesc: raw.SIItemDesc,
          SectionName: raw.SectionName,
          Is_Applicable: existing ? existing.Is_Applicable : 4,
          Recommendation: existing ? existing.Recommendation || '' : '',
          ResponsiblePerson: existing ? existing.ResponsiblePerson || '' : '',
          ACDate: existing && existing.ACDate ? existing.ACDate.substring(0, 10) : new Date().toLocaleDateString('en-CA')
        };
      });

      setFormData({
        SafetyRefNum: data.SafetyRefNum || '',
        ProjectID: data.ProjectID || '',
        SIDate: data.SIDate ? data.SIDate.substring(0, 10) : new Date().toLocaleDateString('en-CA'),
        ProjectLocation: data.ProjectLocation || '',
        InspectedBy: data.InspectedBy || '',
        Address: data.Address || '',
        Safety_Cert_Info: data.Safety_Cert_Info || '',
        Senior_Construction_Manager: data.Senior_Construction_Manager || '',
        Project_Manager: data.Project_Manager || '',
        Site_Manager: data.Site_Manager || '',
        Zone_Construction_Manager: data.Zone_Construction_Manager || '',
        Safety_Manager: data.Safety_Manager || '',
        Safety_Officer: data.Safety_Officer || '',
        details: mappedDetails
      });
      setFormErrors({});
    } catch (error) {
      setToast({ open: true, message: 'Failed to load safety inspection checklist details.', severity: 'error' });
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

  const handleDetailChange = (index, fieldName, value) => {
    setFormData(prev => {
      const updatedDetails = [...prev.details];
      updatedDetails[index] = { ...updatedDetails[index], [fieldName]: value };
      return { ...prev, details: updatedDetails };
    });
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;
    if (!formData.ProjectID) {
      errors.ProjectID = 'Project is required.';
      isValid = false;
    }
    if (!formData.SafetyRefNum) {
      errors.SafetyRefNum = 'Ref Number is required.';
      isValid = false;
    }
    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      if (safetyInspectionId) {
        await API.put(`/safety/inspections/${safetyInspectionId}`, formData);
        setToast({ open: true, message: 'Inspection checklist updated successfully.', severity: 'success' });
      } else {
        await API.post('/safety/inspections', formData);
        setToast({ open: true, message: 'Inspection checklist created successfully.', severity: 'success' });
      }
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1500);
    } catch (error) {
      setToast({
        open: true,
        message: error.response?.data?.message || error.message || 'Failed to save checklist.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Group items by section
  const sections = {};
  formData.details.forEach((item, index) => {
    const sec = item.SectionName || 'General';
    if (!sections[sec]) sections[sec] = [];
    sections[sec].push({ ...item, originalIndex: index });
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <Loader open={loading} />
      <DialogTitle sx={{ fontWeight: 800 }}>
        {safetyInspectionId ? 'Edit Safety Inspection Checklist' : 'New Safety Inspection Checklist'}
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        <Box component="form" noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          
          {/* General Inspection Details */}
          <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>General Inspection Details</Typography>
          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={4}>
              <TextField
                required
                fullWidth
                label="Safety Ref No."
                name="SafetyRefNum"
                value={formData.SafetyRefNum}
                onChange={handleInputChange}
                error={!!formErrors.SafetyRefNum}
                helperText={formErrors.SafetyRefNum}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth required error={!!formErrors.ProjectID}>
                <InputLabel id="project-select-label">Project</InputLabel>
                <Select
                  labelId="project-select-label"
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

            <Grid item xs={12} sm={4}>
              <FormDatePicker
                required
                label="Inspection Date"
                value={formData.SIDate}
                onChange={(val) => setFormData(prev => ({ ...prev, SIDate: val }))}
                margin="none"
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Project Location"
                name="ProjectLocation"
                value={formData.ProjectLocation}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel id="inspectedby-label">Inspected By</InputLabel>
                <Select
                  labelId="inspectedby-label"
                  label="Inspected By"
                  name="InspectedBy"
                  value={formData.InspectedBy}
                  onChange={handleInputChange}
                >
                  {employees.map(emp => (
                    <MenuItem key={emp.UserID} value={`${emp.FirstName} ${emp.LastName || ''}`.trim()}>
                      {emp.FirstName} {emp.LastName || ''}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Address"
                name="Address"
                value={formData.Address}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Safety Cert Info"
                name="Safety_Cert_Info"
                value={formData.Safety_Cert_Info}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>

          <Divider />

          {/* Checklist Audit Section */}
          <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>Inspection Items Checklist</Typography>

          {Object.keys(sections).map(sectionTitle => (
            <Box key={sectionTitle} sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, bgcolor: 'action.hover', p: 1, borderRadius: 1, mb: 1 }}>
                {sectionTitle}
              </Typography>

              <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1 }}>
                <Table size="small">
                  <TableHead sx={{ bgcolor: 'action.selected' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, width: '40%' }}>Audit Item Description</TableCell>
                      <TableCell sx={{ fontWeight: 700, width: '25%' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 700, width: '15%' }}>Recommendation</TableCell>
                      <TableCell sx={{ fontWeight: 700, width: '10%' }}>Responsible</TableCell>
                      <TableCell sx={{ fontWeight: 700, width: '10%' }}>Deadline</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sections[sectionTitle].map(item => (
                      <TableRow key={item.originalIndex} hover>
                        <TableCell sx={{ fontSize: '0.75rem' }}>{item.SIItemDescription}</TableCell>
                        <TableCell>
                          <RadioGroup
                            row
                            value={item.Is_Applicable}
                            onChange={(e) => handleDetailChange(item.originalIndex, 'Is_Applicable', parseInt(e.target.value, 10))}
                          >
                            <FormControlLabel value={1} control={<Radio size="small" />} label="G" sx={{ '& .MuiTypography-root': { fontSize: '0.75rem' } }} />
                            <FormControlLabel value={2} control={<Radio size="small" />} label="A" sx={{ '& .MuiTypography-root': { fontSize: '0.75rem' } }} />
                            <FormControlLabel value={3} control={<Radio size="small" />} label="P" sx={{ '& .MuiTypography-root': { fontSize: '0.75rem' } }} />
                            <FormControlLabel value={4} control={<Radio size="small" />} label="NA" sx={{ '& .MuiTypography-root': { fontSize: '0.75rem' } }} />
                          </RadioGroup>
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            size="small"
                            value={item.Recommendation}
                            onChange={(e) => handleDetailChange(item.originalIndex, 'Recommendation', e.target.value)}
                            placeholder="Add recommendation..."
                            inputProps={{ style: { fontSize: '0.75rem' } }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            size="small"
                            value={item.ResponsiblePerson}
                            onChange={(e) => handleDetailChange(item.originalIndex, 'ResponsiblePerson', e.target.value)}
                            placeholder="Person"
                            inputProps={{ style: { fontSize: '0.75rem' } }}
                          />
                        </TableCell>
                        <TableCell>
                          <FormDatePicker
                            value={item.ACDate}
                            onChange={(val) => handleDetailChange(item.originalIndex, 'ACDate', val)}
                            margin="none"
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ))}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2, textTransform: 'none' }}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          startIcon={<SaveIcon />}
          sx={{ borderRadius: 2, textTransform: 'none', px: 4 }}
        >
          Submit Inspection
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
