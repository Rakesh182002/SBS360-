import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Box, Card, CardContent, Typography, Button, 
  Grid, TableContainer, Table, TableHead, TableRow, TableCell, 
  TableBody, Paper
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';

import API from '../../../services/api';
import { Loader, ToastNotification, Breadcrumb } from '../../../components/ReusableComponents';
import ClientFormDialog from './ClientFormDialog';

export default function ClientDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [client, setClient] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [openClientDialog, setOpenClientDialog] = useState(false);

  const handleDialogSuccess = () => {
    setOpenClientDialog(false);
    fetchClientDetails();
  };

  useEffect(() => {
    fetchClientDetails();
  }, [id]);

  const fetchClientDetails = async () => {
    setLoading(true);
    try {
      const response = await API.get(`/clients/${id}`);
      setClient(response.data.data);
    } catch (error) {
      setToast({
        open: true,
        message: error.message || 'Failed to fetch client details.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Loader open={loading} />

      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>Client Details</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant="outlined" 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate('/client')}
            sx={{ borderRadius: 2 }}
          >
            Back
          </Button>
          <Button 
            variant="contained" 
            startIcon={<EditIcon />} 
            onClick={() => setOpenClientDialog(true)}
            sx={{ borderRadius: 2 }}
          >
            Edit Profile
          </Button>
        </Box>
      </Box>

      {client && (
        <Grid container spacing={3}>
          {/* Company Details */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.01)' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 700, mb: 2 }}>Company Info</Typography>
                <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, width: '25%', bgcolor: 'action.hover' }}>Company Name</TableCell>
                        <TableCell sx={{ width: '75%' }}>{client.Company_Name}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Client ID / Display ID</TableCell>
                        <TableCell>{client.ClientDisplayID}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Reference Source</TableCell>
                        <TableCell>{client.Reference || '-'}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Registered Address */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.01)' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 700, mb: 2 }}>Registered Office Address</Typography>
                <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, width: '20%', bgcolor: 'action.hover' }}>Address Line 1</TableCell>
                        <TableCell sx={{ width: '30%' }}>{client.Address1 || '-'}</TableCell>
                        <TableCell sx={{ fontWeight: 700, width: '20%', bgcolor: 'action.hover' }}>Address Line 2</TableCell>
                        <TableCell sx={{ width: '30%' }}>{client.Address2 || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>City</TableCell>
                        <TableCell>{client.City || '-'}</TableCell>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Postal Code</TableCell>
                        <TableCell>{client.Postal_Code || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Country</TableCell>
                        <TableCell>{client.Country || '-'}</TableCell>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Primary Email</TableCell>
                        <TableCell>{client.Email || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Mobile Phone</TableCell>
                        <TableCell>{client.Mobile || '-'}</TableCell>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Tel Phone</TableCell>
                        <TableCell>{client.Tel || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Website</TableCell>
                        <TableCell>{client.Web || '-'}</TableCell>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Fax</TableCell>
                        <TableCell>{client.Fax1 || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Skype ID</TableCell>
                        <TableCell>{client.SkypeID || '-'}</TableCell>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Remarks</TableCell>
                        <TableCell>{client.Remarks || '-'}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Associated Point of Contacts */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.01)' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 700, mb: 2 }}>Associated Contacts (SPOCs)</Typography>
                <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                  <Table size="small">
                    <TableHead sx={{ bgcolor: 'action.hover' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>Prefix</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>SPOC Name</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Mobile</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Tel</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Remarks</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {client.contacts && client.contacts.map((contact, idx) => (
                        <TableRow hover key={idx}>
                          <TableCell>{contact.NamePrefix}</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>{contact.SPOCName}</TableCell>
                          <TableCell>{contact.Email || '-'}</TableCell>
                          <TableCell>{contact.Mobile || '-'}</TableCell>
                          <TableCell>{contact.Tel || '-'}</TableCell>
                          <TableCell>{contact.Remarks || '-'}</TableCell>
                        </TableRow>
                      ))}
                      {(!client.contacts || client.contacts.length === 0) && (
                        <TableRow>
                          <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                            <Typography variant="body2" color="text.secondary">No registered contacts associated with this client profile.</Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <ToastNotification 
        open={toast.open} 
        message={toast.message} 
        severity={toast.severity} 
        onClose={() => setToast({ ...toast, open: false })} 
      />

      <ClientFormDialog
        open={openClientDialog}
        onClose={() => setOpenClientDialog(false)}
        clientId={id}
        onSuccess={handleDialogSuccess}
      />
    </Box>
  );
}
