import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Box, Card, CardContent, Typography, Button, Grid, Chip, Avatar, Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';

import API from '../../../services/api';
import { Loader, ToastNotification } from '../../../components/ReusableComponents';
import EmployeeFormDialog from './EmployeeFormDialog';

export default function EmployeeDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [employee, setEmployee] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [openFormDialog, setOpenFormDialog] = useState(false);

  useEffect(() => {
    fetchEmployeeDetails();
  }, [id]);

  const fetchEmployeeDetails = async () => {
    setLoading(true);
    try {
      const response = await API.get(`/employees/${id}`);
      setEmployee(response.data.data);
    } catch (error) {
      setToast({
        open: true,
        message: error.message || 'Failed to fetch employee details.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !employee) {
    return <Loader open={true} />;
  }

  if (!employee) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">No Employee Profile Found.</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/employee')} sx={{ mt: 2 }}>
          Back to List
        </Button>
      </Box>
    );
  }

  const getInitials = () => {
    const first = employee.FirstName ? employee.FirstName[0] : '';
    const last = employee.LastName ? employee.LastName[0] : '';
    return (first + last).toUpperCase() || <PersonIcon />;
  };

  const DetailField = ({ label, value }) => (
    <Box sx={{ mb: 2 }}>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {label}
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary', minHeight: 20 }}>
        {value || '—'}
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Loader open={loading} />

      {/* Header Bar */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>Employee Profile</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button 
            variant="outlined" 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate('/employee')}
            sx={{ borderRadius: 2 }}
          >
            Back
          </Button>
          <Button 
            variant="contained" 
            startIcon={<EditIcon />}
            onClick={() => setOpenFormDialog(true)}
            sx={{ borderRadius: 2, px: 3, fontWeight: 700 }}
          >
            Edit Profile
          </Button>
        </Box>
      </Box>

      {/* Profile Overview Card */}
      <Card sx={{ 
        borderRadius: 3, 
        border: '1px solid', 
        borderColor: 'divider', 
        boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.01)',
        mb: 4,
        background: 'linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(248,250,252,1) 100%)'
      }}>
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', fontSize: '1.8rem', fontWeight: 700, boxShadow: '0 8px 16px rgba(99, 102, 241, 0.15)' }}>
                {getInitials()}
              </Avatar>
            </Grid>
            <Grid item xs={12} sm>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  {employee.FirstName} {employee.LastName}
                </Typography>
                <Chip 
                  label={employee.IsActive === 1 ? 'Active' : 'Inactive'} 
                  color={employee.IsActive === 1 ? 'success' : 'default'}
                  size="small"
                  sx={{ fontWeight: 600, borderRadius: 1.5 }}
                />
              </Box>
              <Typography variant="subtitle1" color="text.secondary" sx={{ fontWeight: 500, mt: 0.5 }}>
                {employee.Designation || 'No Designation'} • {employee.GroupName || 'No Job Group'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm="auto">
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Employee ID:</strong> {employee.EmpID || '—'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>System Login:</strong> {employee.UserName ? `@${employee.UserName}` : 'No Access'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Card 1: Personal Details */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" color="primary" sx={{ fontWeight: 700, mb: 3 }}>
                Personal Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <DetailField label="Gender" value={employee.Gender === 'M' ? 'Male' : employee.Gender === 'F' ? 'Female' : employee.Gender} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailField label="Date of Birth" value={employee.DoB} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailField label="Nationality" value={employee.Nationality} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailField label="Type of ID" value={employee.ID_Type} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailField label="NRIC/FIN" value={employee.ID_Number} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailField label="Passport Number" value={employee.Passport_Number} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailField label="Passport Valid Till" value={employee.Passport_Valid_Till} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 2: Employment Info */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" color="primary" sx={{ fontWeight: 700, mb: 3 }}>
                Employment Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <DetailField label="Operating Branch" value={employee.OpBranch} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailField label="Date of Join" value={employee.DoJ} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailField label="Date of Resignation" value={employee.DoR} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailField label="Designation" value={employee.Designation} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailField label="Basic Salary ($)" value={employee.Salary} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailField label="Levy Amount ($)" value={employee.Levy} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailField label="Job Group Level" value={employee.llevel} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailField label="Profile Description" value={employee.Profile_Desc} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 3: Contact & Address */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" color="primary" sx={{ fontWeight: 700, mb: 3 }}>
                Contact & Address Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <DetailField label="Email Address" value={employee.Email} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailField label="Mobile Number" value={employee.Mobile} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailField label="Telephone" value={employee.Tel} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailField label="Website" value={employee.Web} />
                </Grid>
                <Grid item xs={12}>
                  <DetailField label="Address Line 1" value={employee.Address1} />
                </Grid>
                <Grid item xs={12}>
                  <DetailField label="Address Line 2" value={employee.Address2} />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <DetailField label="City" value={employee.City} />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <DetailField label="Country" value={employee.Country} />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <DetailField label="Postal Code" value={employee.Postal_Code} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 4: Licenses, Passes & Permits */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" color="primary" sx={{ fontWeight: 700, mb: 3 }}>
                Licenses & Safety Certifications
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <DetailField label="Work Permit No" value={employee.Permit_Number} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailField label="Permit Valid From" value={employee.Permit_Valid_From} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailField label="Permit Valid To" value={employee.Permit_Valid_To} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailField label="SOC Number" value={employee.SOC_number} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailField label="SOC Issue Date" value={employee.SOC_Issue_Date} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailField label="SOC Expiry Date" value={employee.SOC_Expiry_Date} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailField label="Driving License No" value={employee.Licence_Number} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailField label="License Expiry" value={employee.Licence_Valid_Till} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailField label="Insurance Number" value={employee.Insurance_Number} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailField label="Insurance Expiry" value={employee.Insurance_Valid_Till} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailField label="Scissor Lift License No" value={employee.License_Scissor_Lift_Number} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailField label="Scissor Lift Expiry" value={employee.License_Scissor_Lift_ExpiryDate} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailField label="Boom Lift License No" value={employee.License_Boom_Lift_Number} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailField label="Boom Lift Expiry" value={employee.License_Boom_Lift_ExpiryDate} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailField label="Work at Height License No" value={employee.License_WorkatHeight_Number} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailField label="Work at Height Expiry" value={employee.License_WorkatHeight_ExpiryDate} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailField label="Island Pass Number" value={employee.License_IslandPass_Number} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailField label="Island Pass Expiry" value={employee.License_IslandPass_ExpiryDate} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailField label="Safety Supervisor" value={employee.Safety_Supervisor_Name} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailField label="Skill Level" value={employee.Skilled_Level === 1 ? 'Skilled' : employee.Skilled_Level === 2 ? 'Unskilled' : employee.Skilled_Level} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailField label="Safety Course Name" value={employee.License_Course} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailField label="Course Expiry" value={employee.License_Course_Expiry_Date} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <EmployeeFormDialog 
        open={openFormDialog} 
        onClose={() => setOpenFormDialog(false)} 
        employeeId={employee.UserID} 
        onSuccess={(msg) => {
          setToast({ open: true, message: msg, severity: 'success' });
          fetchEmployeeDetails();
        }} 
      />

      <ToastNotification 
        open={toast.open} 
        message={toast.message} 
        severity={toast.severity} 
        onClose={() => setToast({ ...toast, open: false })} 
      />
    </Box>
  );
}
