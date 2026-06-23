import React, { useState, useEffect } from 'react';
import { 
  Box, Button, TextField, Grid, Select, MenuItem, 
  FormControl, InputLabel, FormHelperText, Tabs, Tab,
  Dialog, DialogTitle, DialogContent, DialogActions, Typography
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import API from '../../../services/api';
import { Loader, ToastNotification } from '../../../components/ReusableComponents';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`employee-dialog-tabpanel-${index}`}
      aria-labelledby={`employee-dialog-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const convertUIToInputDate = (dateStr) => {
  if (!dateStr || typeof dateStr !== 'string') return '';
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const day = parts[0].padStart(2, '0');
    const month = parts[1].padStart(2, '0');
    const year = parts[2];
    return `${year}-${month}-${day}`;
  }
  return dateStr;
};

const dateFields = [
  'DoB', 'DoJ', 'DoR', 'SOC_Issue_Date', 'SOC_Expiry_Date', 
  'Permit_Valid_From', 'Permit_Valid_To', 'License_Course_Expiry_Date', 
  'Passport_Valid_Till', 'Insurance_Valid_Till', 'Licence_Valid_Till', 
  'License_Scissor_Lift_ExpiryDate', 'License_Boom_Lift_ExpiryDate', 
  'License_WorkatHeight_ExpiryDate', 'License_IslandPass_ExpiryDate'
];

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

export default function EmployeeFormDialog({ open, onClose, employeeId, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [groups, setGroups] = useState([]);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [formErrors, setFormErrors] = useState({});

  const initialEmployeeForm = {
    EmpID: '',
    FirstName: '',
    LastName: '',
    Nationality: '',
    DoB: '',
    Gender: 'M',
    Designation: '',
    ID_Type: 'NRIC',
    ID_Number: '',
    Salary: '',
    Levy: '',
    GroupID: '',
    OpBranch: '',
    DoJ: '',
    DoR: '',
    Profile_Desc: '',
    SOC_number: '',
    SOC_Issue_Date: '',
    SOC_Expiry_Date: '',
    Permit_Number: '',
    Permit_Valid_From: '',
    Permit_Valid_To: '',
    Skilled_Level: '',
    Safety_Supervisor_Name: '',
    License_Course: '',
    License_Course_Expiry_Date: '',
    Passport_Number: '',
    Passport_Valid_Till: '',
    Insurance_Number: '',
    Insurance_Valid_Till: '',
    Licence_Number: '',
    Licence_Valid_Till: '',
    License_Scissor_Lift_Number: '',
    License_Scissor_Lift_ExpiryDate: '',
    License_Boom_Lift_Number: '',
    License_Boom_Lift_ExpiryDate: '',
    License_WorkatHeight_Number: '',
    License_WorkatHeight_ExpiryDate: '',
    License_IslandPass_Number: '',
    License_IslandPass_ExpiryDate: '',
    llevel: '',
    UserName: '',
    Password: '',
    
    // Address fields
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

  const [formData, setFormData] = useState(initialEmployeeForm);

  useEffect(() => {
    if (open) {
      setActiveTab(0);
      setFormErrors({});
      fetchInitialData();
    }
  }, [open, employeeId]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Job groups
      const grpResponse = await API.get('/employees/groups');
      setGroups(grpResponse.data.data || []);

      if (employeeId) {
        // Edit mode: fetch employee details
        const empResponse = await API.get(`/employees/${employeeId}`);
        const emp = empResponse.data.data;
        
        // Convert all date fields to YYYY-MM-DD for native HTML date inputs
        const convertedEmp = { ...emp };
        for (const field of dateFields) {
          if (convertedEmp[field]) {
            convertedEmp[field] = convertUIToInputDate(convertedEmp[field]);
          }
        }
        
        setFormData({
          EmpID: convertedEmp.EmpID || '',
          FirstName: convertedEmp.FirstName || '',
          LastName: convertedEmp.LastName || '',
          Nationality: convertedEmp.Nationality || '',
          DoB: convertedEmp.DoB || '',
          Gender: convertedEmp.Gender || 'M',
          Designation: convertedEmp.Designation || '',
          ID_Type: convertedEmp.ID_Type || 'NRIC',
          ID_Number: convertedEmp.ID_Number || '',
          Salary: convertedEmp.Salary || '',
          Levy: convertedEmp.Levy || '',
          GroupID: convertedEmp.GroupID || '',
          OpBranch: convertedEmp.OpBranch || '',
          DoJ: convertedEmp.DoJ || '',
          DoR: convertedEmp.DoR || '',
          Profile_Desc: convertedEmp.Profile_Desc || '',
          SOC_number: convertedEmp.SOC_number || '',
          SOC_Issue_Date: convertedEmp.SOC_Issue_Date || '',
          SOC_Expiry_Date: convertedEmp.SOC_Expiry_Date || '',
          Permit_Number: convertedEmp.Permit_Number || '',
          Permit_Valid_From: convertedEmp.Permit_Valid_From || '',
          Permit_Valid_To: convertedEmp.Permit_Valid_To || '',
          Skilled_Level: convertedEmp.Skilled_Level || '',
          Safety_Supervisor_Name: convertedEmp.Safety_Supervisor_Name || '',
          License_Course: convertedEmp.License_Course || '',
          License_Course_Expiry_Date: convertedEmp.License_Course_Expiry_Date || '',
          Passport_Number: convertedEmp.Passport_Number || '',
          Passport_Valid_Till: convertedEmp.Passport_Valid_Till || '',
          Insurance_Number: convertedEmp.Insurance_Number || '',
          Insurance_Valid_Till: convertedEmp.Insurance_Valid_Till || '',
          Licence_Number: convertedEmp.Licence_Number || '',
          Licence_Valid_Till: convertedEmp.Licence_Valid_Till || '',
          License_Scissor_Lift_Number: convertedEmp.License_Scissor_Lift_Number || '',
          License_Scissor_Lift_ExpiryDate: convertedEmp.License_Scissor_Lift_ExpiryDate || '',
          License_Boom_Lift_Number: convertedEmp.License_Boom_Lift_Number || '',
          License_Boom_Lift_ExpiryDate: convertedEmp.License_Boom_Lift_ExpiryDate || '',
          License_WorkatHeight_Number: convertedEmp.License_WorkatHeight_Number || '',
          License_WorkatHeight_ExpiryDate: convertedEmp.License_WorkatHeight_ExpiryDate || '',
          License_IslandPass_Number: convertedEmp.License_IslandPass_Number || '',
          License_IslandPass_ExpiryDate: convertedEmp.License_IslandPass_ExpiryDate || '',
          llevel: convertedEmp.llevel || '',
          UserName: convertedEmp.UserName || '',
          Password: '',
          
          address: {
            Email: convertedEmp.Email || '',
            Mobile: convertedEmp.Mobile || '',
            Tel: convertedEmp.Tel || '',
            Web: convertedEmp.Web || '',
            Address1: convertedEmp.Address1 || '',
            Address2: convertedEmp.Address2 || '',
            City: convertedEmp.City || '',
            Country: convertedEmp.Country || '',
            Postal_Code: convertedEmp.Postal_Code || '',
            Fax1: convertedEmp.Fax1 || '',
            SkypeID: convertedEmp.SkypeID || '',
            Remarks: convertedEmp.AddressRemarks || convertedEmp.Remarks || ''
          }
        });
      } else {
        // Add mode: reset form
        setFormData(initialEmployeeForm);
      }
    } catch (error) {
      setToast({
        open: true,
        message: error.message || 'Failed to initialize dialog data.',
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

  const validateForm = () => {
    const errors = {};
    let firstErrorTab = null;

    if (!formData.FirstName.trim()) {
      errors.FirstName = 'First name is required.';
      if (firstErrorTab === null) firstErrorTab = 0;
    }
    if (!formData.LastName.trim()) {
      errors.LastName = 'Last name is required.';
      if (firstErrorTab === null) firstErrorTab = 0;
    }
    if (!formData.GroupID) {
      errors.GroupID = 'Job group role is required.';
      if (firstErrorTab === null) firstErrorTab = 0;
    }
    if (!employeeId && formData.UserName.trim() && !formData.Password) {
      errors.Password = 'Password is required when system username is set.';
      if (firstErrorTab === null) firstErrorTab = 0;
    }
    
    setFormErrors(errors);

    if (firstErrorTab !== null) {
      setActiveTab(firstErrorTab);
      setToast({
        open: true,
        message: 'Please resolve form errors in the highlighted fields.',
        severity: 'error'
      });
      return false;
    }
    
    return true;
  };

  const handleSaveEmployee = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (employeeId) {
        await API.put(`/employees/${employeeId}`, formData);
        onSuccess('Employee profile updated successfully.');
      } else {
        await API.post('/employees', formData);
        onSuccess('Employee registered successfully.');
      }
      onClose();
    } catch (error) {
      setToast({
        open: true,
        message: error.message || 'Failed to save employee details.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3, maxHeight: '90vh' } }}
    >
      <Loader open={loading} />
      <DialogTitle sx={{ fontWeight: 800, borderBottom: '1px solid', borderColor: 'divider', py: 2 }}>
        {employeeId ? 'Edit Employee Details' : 'Add New Employee'}
      </DialogTitle>
      
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, pt: 1 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            variant="scrollable"
            scrollButtons="auto"
            aria-label="employee dialog tabs"
          >
            <Tab label="Personal Information" />
            <Tab label="Job Information" />
            <Tab label="Licenses & Passes" />
            <Tab label="Contact Information" />
          </Tabs>
        </Box>

        <Box sx={{ px: 3, py: 1 }}>
          {/* Tab 1: Personal Information */}
          <TabPanel value={activeTab} index={0}>
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="FirstName"
                  value={formData.FirstName}
                  onChange={handleInputChange}
                  required
                  error={!!formErrors.FirstName}
                  helperText={formErrors.FirstName}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="LastName"
                  value={formData.LastName}
                  onChange={handleInputChange}
                  required
                  error={!!formErrors.LastName}
                  helperText={formErrors.LastName}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Nationality"
                  name="Nationality"
                  value={formData.Nationality}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  name="DoB"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  sx={dateInputStyle}
                  InputProps={{
                    endAdornment: <CalendarMonthIcon sx={{ color: 'text.secondary', fontSize: '1.25rem', pointerEvents: 'none' }} />
                  }}
                  value={formData.DoB}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    name="Gender"
                    value={formData.Gender}
                    label="Gender"
                    onChange={handleInputChange}
                  >
                    <MenuItem value="M">Male</MenuItem>
                    <MenuItem value="F">Female</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Designation"
                  name="Designation"
                  value={formData.Designation}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>ID Card Type</InputLabel>
                  <Select
                    name="ID_Type"
                    required
                    value={formData.ID_Type}
                    label="ID Card Type"
                    onChange={handleInputChange}
                  >
                    <MenuItem value="NRIC">NRIC</MenuItem>
                    <MenuItem value="Work Permit">Work Permit</MenuItem>
                    <MenuItem value="S Pass">S Pass</MenuItem>
                    <MenuItem value="Employment Pass">Employment Pass</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="NRIC / FIN Number"
                  name="ID_Number"
                  value={formData.ID_Number}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Basic Salary ($)"
                  name="Salary"
                  type="number"
                  value={formData.Salary}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Levy ($)"
                  name="Levy"
                  type="number"
                  value={formData.Levy}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth required error={!!formErrors.GroupID}>
                  <InputLabel>Job Group Role</InputLabel>
                  <Select
                    name="GroupID"
                    value={formData.GroupID}
                    label="Job Group Role"
                    onChange={handleInputChange}
                  >
                    {groups.map(group => (
                      <MenuItem key={group.GroupID} value={group.GroupID}>
                        {group.GroupName}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.GroupID && <FormHelperText>{formErrors.GroupID}</FormHelperText>}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Job Level"
                  name="llevel"
                  type="number"
                  value={formData.llevel}
                  onChange={handleInputChange}
                />
              </Grid>

              {/* Login Credentials Section */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>
                  System Login Credentials (Optional)
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="System Username"
                  name="UserName"
                  value={formData.UserName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={employeeId ? "System Password (Leave blank to keep unchanged)" : "System Password"}
                  name="Password"
                  type="password"
                  value={formData.Password}
                  onChange={handleInputChange}
                  error={!!formErrors.Password}
                  helperText={formErrors.Password}
                />
              </Grid>
            </Grid>
          </TabPanel>

          {/* Tab 2: Job Information */}
          <TabPanel value={activeTab} index={1}>
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Operating Branch"
                  name="OpBranch"
                  value={formData.OpBranch}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Date of Joining"
                  name="DoJ"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  sx={dateInputStyle}
                  InputProps={{
                    endAdornment: <CalendarMonthIcon sx={{ color: 'text.secondary', fontSize: '1.25rem', pointerEvents: 'none' }} />
                  }}
                  value={formData.DoJ}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Profile Description"
                  name="Profile_Desc"
                  value={formData.Profile_Desc}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="SOC Number"
                  name="SOC_number"
                  value={formData.SOC_number}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="SOC Issue Date"
                  name="SOC_Issue_Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  sx={dateInputStyle}
                  InputProps={{
                    endAdornment: <CalendarMonthIcon sx={{ color: 'text.secondary', fontSize: '1.25rem', pointerEvents: 'none' }} />
                  }}
                  value={formData.SOC_Issue_Date}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="SOC Expiry Date"
                  name="SOC_Expiry_Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  sx={dateInputStyle}
                  InputProps={{
                    endAdornment: <CalendarMonthIcon sx={{ color: 'text.secondary', fontSize: '1.25rem', pointerEvents: 'none' }} />
                  }}
                  value={formData.SOC_Expiry_Date}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Date of Resignation"
                  name="DoR"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  sx={dateInputStyle}
                  InputProps={{
                    endAdornment: <CalendarMonthIcon sx={{ color: 'text.secondary', fontSize: '1.25rem', pointerEvents: 'none' }} />
                  }}
                  value={formData.DoR}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Work Permit Number"
                  name="Permit_Number"
                  value={formData.Permit_Number}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Permit Valid From"
                  name="Permit_Valid_From"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  sx={dateInputStyle}
                  InputProps={{
                    endAdornment: <CalendarMonthIcon sx={{ color: 'text.secondary', fontSize: '1.25rem', pointerEvents: 'none' }} />
                  }}
                  value={formData.Permit_Valid_From}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Permit Valid To"
                  name="Permit_Valid_To"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  sx={dateInputStyle}
                  InputProps={{
                    endAdornment: <CalendarMonthIcon sx={{ color: 'text.secondary', fontSize: '1.25rem', pointerEvents: 'none' }} />
                  }}
                  value={formData.Permit_Valid_To}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Skilled Level"
                  name="Skilled_Level"
                  value={formData.Skilled_Level}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Safety Supervisor"
                  name="Safety_Supervisor_Name"
                  value={formData.Safety_Supervisor_Name}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Safety Supervisor (Y/N)</InputLabel>
                  <Select
                    name="Safety_Supervisor_Name"
                    value={formData.Safety_Supervisor_Name}
                    label="Safety Supervisor (Y/N)"
                    onChange={handleInputChange}
                  >
                    <MenuItem value="Y">Yes</MenuItem>
                    <MenuItem value="N">No</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="License/Course Name"
                  name="License_Course"
                  value={formData.License_Course}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="License/Course Expiry"
                  name="License_Course_Expiry_Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  sx={dateInputStyle}
                  InputProps={{
                    endAdornment: <CalendarMonthIcon sx={{ color: 'text.secondary', fontSize: '1.25rem', pointerEvents: 'none' }} />
                  }}
                  value={formData.License_Course_Expiry_Date}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
          </TabPanel>

          {/* Tab 3: Licenses & Passes */}
          <TabPanel value={activeTab} index={2}>
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Passport Number"
                  name="Passport_Number"
                  value={formData.Passport_Number}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Passport Valid Till"
                  name="Passport_Valid_Till"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  sx={dateInputStyle}
                  InputProps={{
                    endAdornment: <CalendarMonthIcon sx={{ color: 'text.secondary', fontSize: '1.25rem', pointerEvents: 'none' }} />
                  }}
                  value={formData.Passport_Valid_Till}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Insurance Number"
                  name="Insurance_Number"
                  value={formData.Insurance_Number}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Insurance Expiry"
                  name="Insurance_Valid_Till"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  sx={dateInputStyle}
                  InputProps={{
                    endAdornment: <CalendarMonthIcon sx={{ color: 'text.secondary', fontSize: '1.25rem', pointerEvents: 'none' }} />
                  }}
                  value={formData.Insurance_Valid_Till}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Driving License Number"
                  name="Licence_Number"
                  value={formData.Licence_Number}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="License Valid Till"
                  name="Licence_Valid_Till"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  sx={dateInputStyle}
                  InputProps={{
                    endAdornment: <CalendarMonthIcon sx={{ color: 'text.secondary', fontSize: '1.25rem', pointerEvents: 'none' }} />
                  }}
                  value={formData.Licence_Valid_Till}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Scissor Lift License No"
                  name="License_Scissor_Lift_Number"
                  value={formData.License_Scissor_Lift_Number}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Scissor Lift Expiry"
                  name="License_Scissor_Lift_ExpiryDate"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  sx={dateInputStyle}
                  InputProps={{
                    endAdornment: <CalendarMonthIcon sx={{ color: 'text.secondary', fontSize: '1.25rem', pointerEvents: 'none' }} />
                  }}
                  value={formData.License_Scissor_Lift_ExpiryDate}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Boom Lift License No"
                  name="License_Boom_Lift_Number"
                  value={formData.License_Boom_Lift_Number}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Boom Lift Expiry"
                  name="License_Boom_Lift_ExpiryDate"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  sx={dateInputStyle}
                  InputProps={{
                    endAdornment: <CalendarMonthIcon sx={{ color: 'text.secondary', fontSize: '1.25rem', pointerEvents: 'none' }} />
                  }}
                  value={formData.License_Boom_Lift_ExpiryDate}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Work at Height License No"
                  name="License_WorkatHeight_Number"
                  value={formData.License_WorkatHeight_Number}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Work at Height Expiry"
                  name="License_WorkatHeight_ExpiryDate"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  sx={dateInputStyle}
                  InputProps={{
                    endAdornment: <CalendarMonthIcon sx={{ color: 'text.secondary', fontSize: '1.25rem', pointerEvents: 'none' }} />
                  }}
                  value={formData.License_WorkatHeight_ExpiryDate}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Island Pass Number"
                  name="License_IslandPass_Number"
                  value={formData.License_IslandPass_Number}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Island Pass Expiry"
                  name="License_IslandPass_ExpiryDate"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  sx={dateInputStyle}
                  InputProps={{
                    endAdornment: <CalendarMonthIcon sx={{ color: 'text.secondary', fontSize: '1.25rem', pointerEvents: 'none' }} />
                  }}
                  value={formData.License_IslandPass_ExpiryDate}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
          </TabPanel>

          {/* Tab 4: Contact Information */}
          <TabPanel value={activeTab} index={3}>
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="address.Email"
                  value={formData.address.Email}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Mobile Number"
                  name="address.Mobile"
                  value={formData.address.Mobile}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Telephone"
                  name="address.Tel"
                  value={formData.address.Tel}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Website URL"
                  name="address.Web"
                  value={formData.address.Web}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Fax Number"
                  name="address.Fax1"
                  value={formData.address.Fax1}
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

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Address Line 1"
                  name="address.Address1"
                  value={formData.address.Address1}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
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
                  label="Skype ID"
                  name="address.SkypeID"
                  value={formData.address.SkypeID}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Remarks"
                  name="address.Remarks"
                  value={formData.address.Remarks}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
          </TabPanel>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>
          Cancel
        </Button>
        <Button onClick={handleSaveEmployee} variant="contained" startIcon={<SaveIcon />} sx={{ borderRadius: 2, px: 3 }}>
          {employeeId ? 'Save Changes' : 'Save Employee'}
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
