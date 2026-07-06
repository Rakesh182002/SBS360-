import React, { useState, useEffect } from 'react';
import { 
  Box, Button, TextField, Grid, Typography, Divider, Paper,
  FormControl, InputLabel, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Radio, RadioGroup, FormControlLabel,
  Stepper, Step, StepLabel, Autocomplete, Chip
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

import API from '../../../services/api';
import { Loader, ToastNotification, FormDatePicker } from '../../../components/ReusableComponents';

const standardSteps = [
  'Stage 1: Application',
  'Stage 2: Joint Inspection',
  'Stage 3: Assessed by WSHO',
  'Stage 4: Approval by PM',
  'Stage 5: Completion'
];

const confinedSteps = [
  'Stage 1: Application & Watchman',
  'Stage 2: Evaluation by CS Assessor',
  'Stage 3: Acknowledge by WSHO',
  'Stage 4: Approval by PM',
  'Stage 5: Daily Gas Check',
  'Stage 6: Completion'
];

export default function PtwFormDialog({ open, onClose, ptwId, ptwType, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [activeStep, setActiveStep] = useState(0);

  // Dropdowns
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);
  
  // Form State
  const [formData, setFormData] = useState({
    PTW_type: '',
    CompanyName: 'CITI CONSTRUCTION  ENGINEERING PTE. LTD.',
    ProjectID: '',
    ProjectTitle: '',
    NameOfApplicant: '',
    Date_Time: new Date().toLocaleDateString('en-CA'),
    Sub_con_Name: '',
    Loc_or_GridLineNo: '',
    Start_Date_Time: new Date().toLocaleDateString('en-CA'),
    End_Date_Time: new Date().toLocaleDateString('en-CA'),
    Stage1_Person_Name: '',
    Stage1_Date_Time: new Date().toISOString().substring(0, 16),
    
    // Confined space specific stage 1
    Applicant_Desig: '',
    Work_Description: '',
    Stage1_Watchman_Name: '',
    Stage1_Watchman_ID: '',
    Stage1_Watchman_Company: '',

    // Standard Stage 2 Joint Inspection
    Stage2_Person_Name: '',
    Stage2_Date_Time: new Date().toISOString().substring(0, 16),

    // Confined space Stage 2 Gas evaluations
    Stage2_O2: '',
    Stage2_CO2: '',
    Stage2_LEL: '',
    Stage2_H2S: '',
    Safe_for_Entry: 'Yes',
    Stage2_Assessor_Name: '',
    Stage2_Assessor_Desig: '',
    Stage2_Assessor_Date_Time: new Date().toISOString().substring(0, 16),
    Stage2_Comments: '',

    // Stage 3 Assessed/Acknowledge
    Stage3_Person_Name: '',
    Stage3_Date_Time: new Date().toISOString().substring(0, 16),
    Stage3_WSH_Name: '',
    Stage3_WSH_Desig: '',
    Stage3_WSH_Date_Time: new Date().toISOString().substring(0, 16),
    Stage3_Comments: '',

    // Stage 4 Approved/Signature
    Stage4_Sup_Name: '',
    Stage4_Sup_Date_Time: new Date().toISOString().substring(0, 16),
    Stage4_WSH_Name: '',
    Stage4_WSH_Date_Time: new Date().toISOString().substring(0, 16),
    Stage4_Mng_Name: '',
    Stage4_Mng_Desig: '',
    Stage4_Date_Time: new Date().toISOString().substring(0, 16),
    Stage4_Comments: '',

    // Stage 5/6 Completion
    Stage5_Sup_Person_Name: '',
    Stage5_Sup_Date_Time: new Date().toISOString().substring(0, 16),
    Stage5_Mng_Person_Name: '',
    Stage5_Mng_Date_Time: new Date().toISOString().substring(0, 16),
    Stage6_Person_Name: '',
    Stage6_Person_Desig: '',
    Stage6_Date_Time: new Date().toISOString().substring(0, 16),

    details: [], // Checklist
    workers: [] // Array of employee UserIDs
  });
  const [formErrors, setFormErrors] = useState({});

  const isConfined = ptwType === 'PTWCONSPC' || ptwType === 'Confined Space Permit';
  const steps = isConfined ? confinedSteps : standardSteps;

  useEffect(() => {
    if (open) {
      fetchMasterData();
    }
  }, [open, ptwId, ptwType]);

  const fetchMasterData = async () => {
    setLoading(true);
    try {
      const [resEmployees, resProjects] = await Promise.all([
        API.get('/employees'),
        API.get('/safety/projects').catch(() => ({ data: { data: [] } }))
      ]);

      const loadedEmployees = resEmployees.data.data || [];
      const filteredEmployees = loadedEmployees
        .filter(emp => emp.IsActive == 1 && emp.GroupID == 3)
        .sort((a, b) => (a.FirstName || '').localeCompare(b.FirstName || ''));
        
      const allEmployees = loadedEmployees
        .filter(a => a.IsActive == 1 && a.GroupID != 4 && a.GroupID != 5 && a.GroupID != 7)
        .sort((a, b) => (a.FirstName || '').localeCompare(b.FirstName || ''));
      
      setAllEmployees(allEmployees)
      setEmployees(filteredEmployees);
      setProjects(resProjects.data.data || []);

      // Load config items for Stage 1 Checklist
      const resConfig = await API.get(`/safety/ptw/config/${ptwType}`);
      const rawConfig = resConfig.data.data || [];

      if (ptwId) {
        // Load details for edit
        const resDetails = await API.get(`/safety/ptw/details/${ptwId}?type=${ptwType}`);
        const ptw = resDetails.data.data;
        if (ptw) {
          // Map Checklist configuration
          const mappedDetails = rawConfig.map(cfg => {
            const existing = ptw.details?.find(d => d.PTW_Stage_One_ID === cfg.PTW_Stage_One_ID);
            return {
              PTW_Stage_One_ID: cfg.PTW_Stage_One_ID,
              Item: cfg.Item,
              Is_Applicable: existing ? (existing.Is_Applicable || existing.Is_Applicable_Applicant ) :1 // default to NA
            };
          });

          const mappedWorkers = ptw.workers?.map(w => w.EmployeeID) || [];

          setFormData({
            PTW_type: ptwType,
            CompanyName: ptw.CompanyName || ptw.ContractorName || 'CITI CONSTRUCTION  ENGINEERING PTE. LTD.',
            ProjectID: ptw.ProjectID || '',
            ProjectTitle: ptw.ProjectTitle || '',
            NameOfApplicant: ptw.NameOfApplicant || ptw.Applicant_Name || '',
            Date_Time: ptw.Date_Time ? ptw.Date_Time.substring(0, 10) : ptw.Applicant_Date_Time ? ptw.Applicant_Date_Time.substring(0, 10) : new Date().toLocaleDateString('en-CA'),
            Sub_con_Name: ptw.Sub_con_Name || '',
            Loc_or_GridLineNo: ptw.Loc_or_GridLineNo || ptw.LocationOfWork || '',
            Start_Date_Time: ptw.Start_Date_Time ? ptw.Start_Date_Time.substring(0, 10) : new Date().toLocaleDateString('en-CA'),
            End_Date_Time: ptw.End_Date_Time ? ptw.End_Date_Time.substring(0, 10) : new Date().toLocaleDateString('en-CA'),
            Stage1_Person_Name: ptw.Stage1_Person_Name || '',
            Stage1_Date_Time: ptw.Stage1_Date_Time ? ptw.Stage1_Date_Time.substring(0, 16) : new Date().toISOString().substring(0, 16),
            
            Applicant_Desig: ptw.Applicant_Desig || '',
            Work_Description: ptw.Work_Description || '',
            Stage1_Watchman_Name: ptw.Stage1_Watchman_Name || '',
            Stage1_Watchman_ID: ptw.Stage1_Watchman_ID || '',
            Stage1_Watchman_Company: ptw.Stage1_Watchman_Company || '',

            Stage2_Person_Name: ptw.Stage2_Person_Name || '',
            Stage2_Date_Time: ptw.Stage2_Date_Time ? ptw.Stage2_Date_Time.substring(0, 16) : new Date().toISOString().substring(0, 16),

            Stage2_O2: ptw.Stage2_O2 || '',
            Stage2_CO2: ptw.Stage2_CO2 || '',
            Stage2_LEL: ptw.Stage2_LEL || '',
            Stage2_H2S: ptw.Stage2_H2S || '',
            Safe_for_Entry: ptw.Safe_for_Entry || 'Yes',
            Stage2_Assessor_Name: ptw.Stage2_Assessor_Name || '',
            Stage2_Assessor_Desig: ptw.Stage2_Assessor_Desig || '',
            Stage2_Assessor_Date_Time: ptw.Stage2_Assessor_Date_Time ? ptw.Stage2_Assessor_Date_Time.substring(0, 16) : new Date().toISOString().substring(0, 16),
            Stage2_Comments: ptw.Stage2_Comments || '',

            Stage3_Person_Name: ptw.Stage3_Person_Name || '',
            Stage3_Date_Time: ptw.Stage3_Date_Time ? ptw.Stage3_Date_Time.substring(0, 16) : new Date().toISOString().substring(0, 16),
            Stage3_WSH_Name: ptw.Stage3_WSH_Name || '',
            Stage3_WSH_Desig: ptw.Stage3_WSH_Desig || '',
            Stage3_WSH_Date_Time: ptw.Stage3_WSH_Date_Time ? ptw.Stage3_WSH_Date_Time.substring(0, 16) : new Date().toISOString().substring(0, 16),
            Stage3_Comments: ptw.Stage3_Comments || '',

            Stage4_Sup_Name: ptw.Stage4_Sup_Name || '',
            Stage4_Sup_Date_Time: ptw.Stage4_Sup_Date_Time ? ptw.Stage4_Sup_Date_Time.substring(0, 16) : new Date().toISOString().substring(0, 16),
            Stage4_WSH_Name: ptw.Stage4_WSH_Name || '',
            Stage4_WSH_Date_Time: ptw.Stage4_WSH_Date_Time ? ptw.Stage4_WSH_Date_Time.substring(0, 16) : new Date().toISOString().substring(0, 16),
            Stage4_Mng_Name: ptw.Stage4_Mng_Name || '',
            Stage4_Mng_Desig: ptw.Stage4_Mng_Desig || '',
            Stage4_Date_Time: ptw.Stage4_Date_Time ? ptw.Stage4_Date_Time.substring(0, 16) : new Date().toISOString().substring(0, 16),
            Stage4_Comments: ptw.Stage4_Comments || '',

            Stage5_Sup_Person_Name: ptw.Stage5_Sup_Person_Name || '',
            Stage5_Sup_Date_Time: ptw.Stage5_Sup_Date_Time ? ptw.Stage5_Sup_Date_Time.substring(0, 16) : new Date().toISOString().substring(0, 16),
            Stage5_Mng_Person_Name: ptw.Stage5_Mng_Person_Name || '',
            Stage5_Mng_Date_Time: ptw.Stage5_Mng_Date_Time ? ptw.Stage5_Mng_Date_Time.substring(0, 16) : new Date().toISOString().substring(0, 16),
            Stage6_Person_Name: ptw.Stage6_Person_Name || '',
            Stage6_Person_Desig: ptw.Stage6_Person_Desig || '',
            Stage6_Date_Time: ptw.Stage6_Date_Time ? ptw.Stage6_Date_Time.substring(0, 16) : new Date().toISOString().substring(0, 16),

            details: mappedDetails,
            workers: mappedWorkers,
            CompletedStage: ptw.CompletedStage || 1
          });
          setActiveStep((ptw.CompletedStage || 1) - 1);
        }
      } else {
        // Prepare new form
        const initialDetails = rawConfig.map(cfg => ({
          PTW_Stage_One_ID: cfg.PTW_Stage_One_ID,
          Item: cfg.Item,
          Is_Applicable: 3 // Default to NA
        }));

        setFormData({
          PTW_type: ptwType,
          CompanyName: 'CITI CONSTRUCTION  ENGINEERING PTE. LTD.',
          ProjectID: '',
          ProjectTitle: '',
          NameOfApplicant: '',
          Date_Time: new Date().toLocaleDateString('en-CA'),
          Sub_con_Name: '',
          Loc_or_GridLineNo: '',
          Start_Date_Time: new Date().toLocaleDateString('en-CA'),
          End_Date_Time: new Date().toLocaleDateString('en-CA'),
          Stage1_Person_Name: '',
          Stage1_Date_Time: new Date().toISOString().substring(0, 16),
          
          Applicant_Desig: '',
          Work_Description: '',
          Stage1_Watchman_Name: '',
          Stage1_Watchman_ID: '',
          Stage1_Watchman_Company: '',

          Stage2_Person_Name: '',
          Stage2_Date_Time: new Date().toISOString().substring(0, 16),

          Stage2_O2: '',
          Stage2_CO2: '',
          Stage2_LEL: '',
          Stage2_H2S: '',
          Safe_for_Entry: 'Yes',
          Stage2_Assessor_Name: '',
          Stage2_Assessor_Desig: '',
          Stage2_Assessor_Date_Time: new Date().toISOString().substring(0, 16),
          Stage2_Comments: '',

          Stage3_Person_Name: '',
          Stage3_Date_Time: new Date().toISOString().substring(0, 16),
          Stage3_WSH_Name: '',
          Stage3_WSH_Desig: '',
          Stage3_WSH_Date_Time: new Date().toISOString().substring(0, 16),
          Stage3_Comments: '',

          Stage4_Sup_Name: '',
          Stage4_Sup_Date_Time: new Date().toISOString().substring(0, 16),
          Stage4_WSH_Name: '',
          Stage4_WSH_Date_Time: new Date().toISOString().substring(0, 16),
          Stage4_Mng_Name: '',
          Stage4_Mng_Desig: '',
          Stage4_Date_Time: new Date().toISOString().substring(0, 16),
          Stage4_Comments: '',

          Stage5_Sup_Person_Name: '',
          Stage5_Sup_Date_Time: new Date().toISOString().substring(0, 16),
          Stage5_Mng_Person_Name: '',
          Stage5_Mng_Date_Time: new Date().toISOString().substring(0, 16),
          Stage6_Person_Name: '',
          Stage6_Person_Desig: '',
          Stage6_Date_Time: new Date().toISOString().substring(0, 16),

          details: initialDetails,
          workers: [],
          CompletedStage: 1
        });
        setActiveStep(0);
      }
      setFormErrors({});
    } catch (error) {
      setToast({ open: true, message: 'Failed to load master dropdown sources.', severity: 'error' });
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

  const handleDetailChange = (index, val) => {
    setFormData(prev => {
      const updatedDetails = [...prev.details];
      updatedDetails[index] = { ...updatedDetails[index], Is_Applicable: val };
      return { ...prev, details: updatedDetails };
    });
  };

  const validateStep = () => {
    const errors = {};
    let isValid = true;

    if (activeStep === 0) {
      if (!formData.ProjectID) {
        errors.ProjectID = 'Project is required.';
        isValid = false;
      }
      if (!formData.NameOfApplicant) {
        errors.NameOfApplicant = 'Applicant Name is required.';
        isValid = false;
      }
    }
    setFormErrors(errors);
    return isValid;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setLoading(true);
    try {
      // Calculate current CompletedStage from activeStep
      const submissionData = { ...formData, CompletedStage: activeStep + 1 };
      
      if (ptwId) {
        await API.put(`/safety/ptw/${ptwId}`, submissionData);
        setToast({ open: true, message: 'Permit updated successfully.', severity: 'success' });
      } else {
        await API.post('/safety/ptw', submissionData);
        setToast({ open: true, message: 'Permit created successfully.', severity: 'success' });
      }
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1500);
    } catch (error) {
      setToast({
        open: true,
        message: error.response?.data?.message || error.message || 'Failed to save Permit to Work.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <Loader open={loading} />
      <DialogTitle sx={{ fontWeight: 800 }}>
        {ptwId ? `Update Permit: ${ptwType}` : `New Permit: ${ptwType}`}
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box component="form" noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* STEP 1 LAYOUT */}
          {activeStep === 0 && (
            <>
              <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>Stage 1 Details</Typography>
              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Company Name"
                    name="CompanyName"
                    value={formData.CompanyName}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required error={!!formErrors.ProjectID}>
                    <InputLabel id="ptw-project-label">Project</InputLabel>
                    <Select
                      labelId="ptw-project-label"
                      label="Project"
                      name="ProjectID"
                      value={formData.ProjectID}
                      onChange={(e) => {
                        const proj = projects.find(p => p.ProjectID === e.target.value);
                        setFormData(prev => ({
                          ...prev,
                          ProjectID: e.target.value,
                          ProjectTitle: proj ? proj.ProjectName : ''
                        }));
                      }}
                    >
                      {projects.map(p => (
                        <MenuItem key={p.ProjectID} value={p.ProjectID}>
                          {p.ProjectName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required error={!!formErrors.NameOfApplicant}>
                    <InputLabel id="applicant-select-label">Name of Applicant</InputLabel>
                    <Select
                      labelId="applicant-select-label"
                      label="Name of Applicant"
                      name="NameOfApplicant"
                      value={formData.NameOfApplicant}
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

                <Grid item xs={12} sm={6}>
                  <FormDatePicker
                    label="Date of Permit"
                    value={formData.Date_Time}
                    onChange={(val) => setFormData(prev => ({ ...prev, Date_Time: val }))}
                    margin="none"
                  />
                </Grid>

                {isConfined && (
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Applicant Designation"
                      name="Applicant_Desig"
                      value={formData.Applicant_Desig}
                      onChange={handleInputChange}
                    />
                  </Grid>
                )}

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Sub-Contractor Name"
                    name="Sub_con_Name"
                    value={formData.Sub_con_Name}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={isConfined ? "Location of Confined Space Work" : "Location of Work / Grid Line No"}
                    name="Loc_or_GridLineNo"
                    value={formData.Loc_or_GridLineNo}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormDatePicker
                    label="Start Date"
                    value={formData.Start_Date_Time}
                    onChange={(val) => setFormData(prev => ({ ...prev, Start_Date_Time: val }))}
                    margin="none"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormDatePicker
                    label="End Date"
                    value={formData.End_Date_Time}
                    onChange={(val) => setFormData(prev => ({ ...prev, End_Date_Time: val }))}
                    margin="none"
                  />
                </Grid>

                {isConfined && (
                  <>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Confined Space Watchman Name"
                        name="Stage1_Watchman_Name"
                        value={formData.Stage1_Watchman_Name}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Watchman ID / Permit"
                        name="Stage1_Watchman_ID"
                        value={formData.Stage1_Watchman_ID}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Watchman Company"
                        name="Stage1_Watchman_Company"
                        value={formData.Stage1_Watchman_Company}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        label="Description of Work to be Performed"
                        name="Work_Description"
                        value={formData.Work_Description}
                        onChange={handleInputChange}
                      />
                    </Grid>
                  </>
                )}
              </Grid>

              <Divider sx={{ my: 2 }} />

              {/* Workers Multi-Select */}
              <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>Workers Involved</Typography>
              <Autocomplete
                multiple
                id="workers-autocomplete"
                options={employees}
                getOptionLabel={(option) => `${option.FirstName} ${option.LastName || ''} (${option.ID_Number || 'N/A'})`}
                value={employees.filter(emp => formData.workers.includes(emp.UserID))}
                onChange={(event, newValue) => {
                  setFormData(prev => ({ ...prev, workers: newValue.map(v => v.UserID) }));
                }}
                renderInput={(params) => (
                  <TextField {...params} variant="outlined" label="Select workers..." placeholder="Employees" />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip variant="outlined" label={`${option.FirstName} ${option.LastName || ''}`} {...getTagProps({ index })} />
                  ))
                }
              />

              <Divider sx={{ my: 2 }} />

              {/* Checklist Section */}
              <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>Safety Checklist & Controls</Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead sx={{ bgcolor: 'action.selected' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, width: '70%' }}>Checklist items to implement Tick box - Legend: √ = Yes X = No NA = Not Applicable</TableCell>
                      <TableCell sx={{ fontWeight: 700, width: '30%' }}>Response</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.details.map((item, index) => (
                      <TableRow key={item.PTW_Stage_One_ID} hover>
                        <TableCell sx={{ fontSize: '0.8rem' }}>{item.Item}</TableCell>
                        <TableCell>
                          <RadioGroup
                            row
                            value={item.Is_Applicable}
                            onChange={(e) => handleDetailChange(index, parseInt(e.target.value, 10))}
                          >
                            <FormControlLabel value={1} control={<Radio size="small" />} label="Yes" />
                            <FormControlLabel value={2} control={<Radio size="small" />} label="No" />
                            <FormControlLabel value={3} control={<Radio size="small" />} label="NA" />
                          </RadioGroup>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id="supervisor-select-label">Applicant/Supervisor In-Charge</InputLabel>
                    <Select
                      labelId="supervisor-select-label"
                      label="Applicant/Supervisor In-Charge"
                      name="Stage1_Person_Name"
                      value={formData.Stage1_Person_Name}
                      onChange={handleInputChange}
                    >
                      {allEmployees.map(emp => (
                        <MenuItem key={emp.UserID} value={`${emp.FirstName} ${emp.LastName || ''}`.trim()}>
                          {emp.FirstName} {emp.LastName || ''}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="datetime-local"
                    label="Supervisor Sign Date/Time"
                    name="Stage1_Date_Time"
                    value={formData.Stage1_Date_Time}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </>
          )}

          {/* STEP 2: Joint Inspection or evaluation */}
          {activeStep === 1 && (
            <>
              <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                {isConfined ? "Stage 2: Gas Evaluations & Assessment" : "Stage 2: Joint Site Inspection"}
              </Typography>
              <Grid container spacing={2.5}>
                {isConfined ? (
                  <>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        label="Oxygen level (O2) % (19.5 - 23.5)"
                        name="Stage2_O2"
                        value={formData.Stage2_O2}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        label="Carbon Monoxide (CO) ppm (<25)"
                        name="Stage2_CO2"
                        value={formData.Stage2_CO2}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        label="Flammable Gases (LEL) % (<10%)"
                        name="Stage2_LEL"
                        value={formData.Stage2_LEL}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        label="Hydrogen Sulfide (H2S) ppm (<10)"
                        name="Stage2_H2S"
                        value={formData.Stage2_H2S}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel id="safe-entry-label">Safe for Entry?</InputLabel>
                        <Select
                          labelId="safe-entry-label"
                          label="Safe for Entry?"
                          name="Safe_for_Entry"
                          value={formData.Safe_for_Entry}
                          onChange={handleInputChange}
                        >
                          <MenuItem value="Yes">Yes</MenuItem>
                          <MenuItem value="No">No</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Assessor Name"
                        name="Stage2_Assessor_Name"
                        value={formData.Stage2_Assessor_Name}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Assessor Designation"
                        name="Stage2_Assessor_Desig"
                        value={formData.Stage2_Assessor_Desig}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        type="datetime-local"
                        label="Evaluation Date & Time"
                        name="Stage2_Assessor_Date_Time"
                        value={formData.Stage2_Assessor_Date_Time}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Assessor Comments"
                        name="Stage2_Comments"
                        value={formData.Stage2_Comments}
                        onChange={handleInputChange}
                      />
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel id="stage2-person-label">Joint Inspection Assessor / Supervisor</InputLabel>
                        <Select
                          labelId="stage2-person-label"
                          label="Joint Inspection Assessor / Supervisor"
                          name="Stage2_Person_Name"
                          value={formData.Stage2_Person_Name}
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
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        type="datetime-local"
                        label="Joint Inspection Date & Time"
                        name="Stage2_Date_Time"
                        value={formData.Stage2_Date_Time}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            </>
          )}

          {/* STEP 3: Assessed by WSHO */}
          {activeStep === 2 && (
            <>
              <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                {isConfined ? "Stage 3: Acknowledged by WSHO" : "Stage 3: Assessed by WSHO"}
              </Typography>
              <Grid container spacing={2.5}>
                {isConfined ? (
                  <>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="WSHO Name"
                        name="Stage3_WSH_Name"
                        value={formData.Stage3_WSH_Name}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="WSHO Designation"
                        name="Stage3_WSH_Desig"
                        value={formData.Stage3_WSH_Desig}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        type="datetime-local"
                        label="Acknowledgement Date & Time"
                        name="Stage3_WSH_Date_Time"
                        value={formData.Stage3_WSH_Date_Time}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="WSH Remarks"
                        name="Stage3_Comments"
                        value={formData.Stage3_Comments}
                        onChange={handleInputChange}
                      />
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel id="stage3-person-label">Assessed Safety Officer (WSHO)</InputLabel>
                        <Select
                          labelId="stage3-person-label"
                          label="Assessed Safety Officer (WSHO)"
                          name="Stage3_Person_Name"
                          value={formData.Stage3_Person_Name}
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
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        type="datetime-local"
                        label="Assessed Date & Time"
                        name="Stage3_Date_Time"
                        value={formData.Stage3_Date_Time}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            </>
          )}

          {/* STEP 4: Approved by PM */}
          {activeStep === 3 && (
            <>
              <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>Stage 4: Approval by Project Manager</Typography>
              <Grid container spacing={2.5}>
                {isConfined ? (
                  <>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Project Manager Name"
                        name="Stage4_Mng_Name"
                        value={formData.Stage4_Mng_Name}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Project Manager Designation"
                        name="Stage4_Mng_Desig"
                        value={formData.Stage4_Mng_Desig}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        type="datetime-local"
                        label="Approval Date & Time"
                        name="Stage4_Date_Time"
                        value={formData.Stage4_Date_Time}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Approval Comments"
                        name="Stage4_Comments"
                        value={formData.Stage4_Comments}
                        onChange={handleInputChange}
                      />
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Supervisor (Authorized Sign)"
                        name="Stage4_Sup_Name"
                        value={formData.Stage4_Sup_Name}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        type="datetime-local"
                        label="Supervisor Sign Date/Time"
                        name="Stage4_Sup_Date_Time"
                        value={formData.Stage4_Sup_Date_Time}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="WSHO / Safety Assessor Approve"
                        name="Stage4_WSH_Name"
                        value={formData.Stage4_WSH_Name}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        type="datetime-local"
                        label="Safety Assessor Date/Time"
                        name="Stage4_WSH_Date_Time"
                        value={formData.Stage4_WSH_Date_Time}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            </>
          )}

          {/* STEP 5: Daily Gas Check (Confined Space) or Completion (Standard) */}
          {activeStep === 4 && (
            <>
              {isConfined ? (
                <>
                  <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>Stage 5: Daily Gas Checking Checklist</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Please check daily oxygen levels, flammable gases, toxic gases, ventilation, and ensure safety parameters remain stable prior to workers entering the confined space.
                  </Typography>
                  <Grid container spacing={2.5}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Daily CS Assessor Signature"
                        name="Stage5_Sup_Person_Name"
                        value={formData.Stage5_Sup_Person_Name}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        type="datetime-local"
                        label="Assessor Sign Date/Time"
                        name="Stage5_Sup_Date_Time"
                        value={formData.Stage5_Sup_Date_Time}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </Grid>
                </>
              ) : (
                <>
                  <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>Stage 5: Completion & Handover</Typography>
                  <Grid container spacing={2.5}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Supervisor In-Charge (Work Finished)"
                        name="Stage5_Sup_Person_Name"
                        value={formData.Stage5_Sup_Person_Name}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        type="datetime-local"
                        label="Supervisor Done Date/Time"
                        name="Stage5_Sup_Date_Time"
                        value={formData.Stage5_Sup_Date_Time}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Authorized Manager (Acknowledge Complete)"
                        name="Stage5_Mng_Person_Name"
                        value={formData.Stage5_Mng_Person_Name}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        type="datetime-local"
                        label="Manager Done Date/Time"
                        name="Stage5_Mng_Date_Time"
                        value={formData.Stage5_Mng_Date_Time}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </Grid>
                </>
              )}
            </>
          )}

          {/* STEP 6: Completion (Confined Space Only) */}
          {activeStep === 5 && isConfined && (
            <>
              <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>Stage 6: Completion & Safe Handover</Typography>
              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="CS Supervisor Name"
                    name="Stage6_Person_Name"
                    value={formData.Stage6_Person_Name}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="CS Supervisor Designation"
                    name="Stage6_Person_Desig"
                    value={formData.Stage6_Person_Desig}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="datetime-local"
                    label="Completion Date & Time"
                    name="Stage6_Date_Time"
                    value={formData.Stage6_Date_Time}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, justifyContent: 'space-between' }}>
        <Button
          onClick={handleBack}
          disabled={activeStep === 0}
          variant="outlined"
          sx={{ borderRadius: 2, textTransform: 'none' }}
        >
          Back
        </Button>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button onClick={onClose} variant="text" sx={{ borderRadius: 2, textTransform: 'none' }}>
            Cancel
          </Button>
          
          {activeStep < steps.length - 1 ? (
            <Button
              onClick={handleNext}
              variant="outlined"
              sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}
            >
              Next Step
            </Button>
          ) : null}

          <Button
            onClick={handleSubmit}
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{ borderRadius: 2, textTransform: 'none', px: 4 }}
          >
            {ptwId ? 'Save Progress' : 'Submit Application'}
          </Button>
        </Box>
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
