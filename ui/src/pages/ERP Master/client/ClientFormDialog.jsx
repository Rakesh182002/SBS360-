import React, { useState, useEffect } from 'react';
import { 
  Box, Button, TextField, Grid, Dialog, DialogTitle, DialogContent, DialogActions, Typography,
  IconButton, Card, CardContent, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import API from '../../../services/api';
import { Loader, ToastNotification } from '../../../components/ReusableComponents';

export default function ClientFormDialog({ open, onClose, clientId, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [formErrors, setFormErrors] = useState({});

  const initialClientForm = {
    Company_Name: '',
    Reference: '',
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

  const [formData, setFormData] = useState(initialClientForm);
  const [formContacts, setFormContacts] = useState([]);
  const [deletedContactIds, setDeletedContactIds] = useState([]);

  // Sub-dialog state for Client Contacts
  const [openContactModal, setOpenContactModal] = useState(false);
  const [contactFormType, setContactFormType] = useState('create'); // 'create' or 'edit'
  const [contactFormIndex, setContactFormIndex] = useState(null);
  
  const initialContactForm = {
    CCID: 0,
    NamePrefix: 'Mr. ',
    SPOCName: '',
    Email: '',
    Mobile: '',
    Tel: '',
    Remarks: ''
  };
  
  const [contactFormData, setContactFormData] = useState(initialContactForm);
  const [contactFormErrors, setContactFormErrors] = useState({});

  useEffect(() => {
    if (open) {
      setFormErrors({});
      setDeletedContactIds([]);
      if (clientId) {
        fetchClientDetails();
      } else {
        setFormData(initialClientForm);
        setFormContacts([]);
      }
    }
  }, [open, clientId]);

  const fetchClientDetails = async () => {
    setLoading(true);
    try {
      const response = await API.get(`/clients/${clientId}`);
      const client = response.data.data;
      
      setFormData({
        ClientID: client.ClientID,
        ClientDisplayID: client.ClientDisplayID || '',
        Company_Name: client.Company_Name || '',
        Reference: client.Reference || '',
        address: {
          Email: client.Email || '',
          Mobile: client.Mobile || '',
          Tel: client.Tel || '',
          Web: client.Web || '',
          Address1: client.Address1 || '',
          Address2: client.Address2 || '',
          City: client.City || '',
          Country: client.Country || 'Singapore',
          Postal_Code: client.Postal_Code || '',
          Fax1: client.Fax1 || '',
          SkypeID: client.SkypeID || '',
          Remarks: client.Remarks || ''
        }
      });
      setFormContacts(client.contacts || []);
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

  // Contacts handler methods
  const handleOpenCreateContactModal = () => {
    setContactFormType('create');
    setContactFormData(initialContactForm);
    setContactFormIndex(null);
    setContactFormErrors({});
    setOpenContactModal(true);
  };

  const handleOpenEditContactModal = (index) => {
    setContactFormType('edit');
    setContactFormData(formContacts[index]);
    setContactFormIndex(index);
    setContactFormErrors({});
    setOpenContactModal(true);
  };

  const handleRemoveContact = (index) => {
    const contact = formContacts[index];
    if (contact.CCID && contact.CCID > 0) {
      setDeletedContactIds(prev => [...prev, contact.CCID]);
    }
    setFormContacts(prev => prev.filter((_, i) => i !== index));
  };

  const handleContactInputChange = (e) => {
    const { name, value } = e.target;
    setContactFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (contactFormErrors[name]) {
      setContactFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSaveContact = () => {
    const errors = {};
    if (!contactFormData.SPOCName.trim()) {
      errors.SPOCName = 'Contact name is required.';
    }
    if (contactFormData.Email && !/\S+@\S+\.\S+/.test(contactFormData.Email)) {
      errors.Email = 'Please enter a valid email address.';
    }
    
    if (Object.keys(errors).length > 0) {
      setContactFormErrors(errors);
      return;
    }

    if (contactFormType === 'create') {
      setFormContacts(prev => [...prev, contactFormData]);
    } else {
      setFormContacts(prev => prev.map((item, idx) => idx === contactFormIndex ? contactFormData : item));
    }
    setOpenContactModal(false);
  };

  const handleSaveClient = async (e) => {
    if (e) e.preventDefault();
    
    // Validate Company Name
    const errors = {};
    let isValid = true;

    if (!formData.Company_Name || !formData.Company_Name.trim()) {
      errors.Company_Name = 'Company Name is required.';
      isValid = false;
    } else if (formData.Company_Name.length > 150) {
      errors.Company_Name = 'Company Name cannot exceed 150 characters.';
      isValid = false;
    }

    if (formData.address.Email && !/\S+@\S+\.\S+/.test(formData.address.Email)) {
      errors.Email = 'Please enter a valid company email address.';
      isValid = false;
    }
    
    if (formContacts.length === 0) {
      setToast({
        open: true,
        message: 'At least one Point of Contact (SPOC) is required.',
        severity: 'warning'
      });
      isValid = false;
    } else {
      const invalidContacts = formContacts.filter(c => !c.SPOCName || !c.SPOCName.trim());
      if (invalidContacts.length > 0) {
        setToast({
          open: true,
          message: 'All added contacts must have a contact name.',
          severity: 'warning'
        });
        isValid = false;
      }
    }
    
    setFormErrors(errors);

    if (!isValid) {
      return;
    }

    setLoading(true);
    try {
      const payload = {
        Company_Name: formData.Company_Name.trim(),
        Reference: formData.Reference.trim(),
        address: formData.address,
        contacts: formContacts,
        deleted: clientId ? deletedContactIds : undefined
      };

      if (clientId) {
        await API.put(`/clients/${clientId}`, payload);
        setToast({ open: true, message: 'Client details updated successfully.', severity: 'success' });
      } else {
        await API.post('/clients', payload);
        setToast({ open: true, message: 'Client registered successfully.', severity: 'success' });
      }

      setTimeout(() => {
        setLoading(false);
        onSuccess();
      }, 800);

    } catch (error) {
      setToast({
        open: true,
        message: error.message || 'Failed to save client details.',
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
        {clientId ? 'Edit Client Profile' : 'Register New Client'}
      </DialogTitle>

      <DialogContent sx={{ p: 3, bgcolor: 'background.default' }}>
        <Loader open={loading} />
        
        <Grid container spacing={3}>
          {/* Left Column: Company Details & Registered Address */}
          <Grid item xs={12} md={8}>
            <Card variant="outlined" sx={{ borderRadius: 2, borderColor: 'divider', boxShadow: 'none' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 700, mb: 2 }}>
                  Company Details
                </Typography>
                
                <Grid container spacing={2}>
                  {clientId && (
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Client Display ID"
                        value={formData.ClientDisplayID || ''}
                        disabled
                      />
                    </Grid>
                  )}
                  <Grid item xs={12} sm={clientId ? 8 : 12}>
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
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Reference Source"
                      name="Reference"
                      value={formData.Reference}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Company Email"
                      name="address.Email"
                      type="email"
                      value={formData.address.Email}
                      onChange={handleInputChange}
                      error={!!formErrors.Email}
                      helperText={formErrors.Email}
                    />
                  </Grid>
                </Grid>

                <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 700, mt: 4, mb: 2 }}>
                  Registered Address & Main Contact
                </Typography>
                
                <Grid container spacing={2}>
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
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Skype ID"
                      name="address.SkypeID"
                      value={formData.address.SkypeID}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Address Line 1"
                      name="address.Address1"
                      value={formData.address.Address1}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
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

          {/* Right Column: SPOC Point of Contacts */}
          <Grid item xs={12} md={4}>
            <Card variant="outlined" sx={{ borderRadius: 2, borderColor: 'divider', boxShadow: 'none', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 700 }}>
                    Contacts / SPOCs
                  </Typography>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    startIcon={<AddIcon />}
                    onClick={handleOpenCreateContactModal}
                    sx={{ borderRadius: 2, fontWeight: 700 }}
                  >
                    Add
                  </Button>
                </Box>

                {formContacts.length === 0 ? (
                  <Box sx={{ 
                    py: 6, 
                    px: 2, 
                    textAlign: 'center', 
                    border: '1px dashed', 
                    borderColor: 'divider', 
                    borderRadius: 2, 
                    bgcolor: 'action.hover',
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <Typography variant="body2" color="text.secondary">
                      No contacts added yet.
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                      At least one contact is required.
                    </Typography>
                    <Button 
                      variant="text" 
                      size="small" 
                      onClick={handleOpenCreateContactModal}
                      sx={{ mt: 1, fontWeight: 700 }}
                    >
                      Add Point of Contact
                    </Button>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: '600px', overflowY: 'auto', pr: 0.5 }}>
                    {formContacts.map((contact, index) => (
                      <Card key={index} variant="outlined" sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                {contact.NamePrefix}{contact.SPOCName}
                              </Typography>
                              {contact.Email && (
                                <Typography variant="caption" color="text.secondary" display="block">
                                  Email: {contact.Email}
                                </Typography>
                              )}
                              {contact.Mobile && (
                                <Typography variant="caption" color="text.secondary" display="block">
                                  Mobile: {contact.Mobile}
                                </Typography>
                              )}
                              {contact.Tel && (
                                <Typography variant="caption" color="text.secondary" display="block">
                                  Tel: {contact.Tel}
                                </Typography>
                              )}
                              {contact.Remarks && (
                                <Typography variant="caption" color="text.secondary" display="block">
                                  Remarks: {contact.Remarks}
                                </Typography>
                              )}
                            </Box>
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              <IconButton size="small" onClick={() => handleOpenEditContactModal(index)}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton size="small" color="error" onClick={() => handleRemoveContact(index)}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>
          Cancel
        </Button>
        <Button onClick={handleSaveClient} variant="contained" startIcon={<SaveIcon />} sx={{ borderRadius: 2, px: 3 }}>
          {clientId ? 'Save Changes' : 'Save Client'}
        </Button>
      </DialogActions>

      {/* Contact Form Sub-Dialog */}
      <Dialog 
        open={openContactModal} 
        onClose={() => setOpenContactModal(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>
          {contactFormType === 'create' ? 'Add New Contact' : 'Edit Contact Detail'}
        </DialogTitle>
        <DialogContent dividers sx={{ py: 1 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Prefix</InputLabel>
            <Select
              name="NamePrefix"
              value={contactFormData.NamePrefix}
              label="Prefix"
              onChange={handleContactInputChange}
            >
              <MenuItem value="Mr. ">Mr.</MenuItem>
              <MenuItem value="Ms. ">Ms.</MenuItem>
              <MenuItem value="Mrs. ">Mrs.</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            required
            label="Contact Name"
            name="SPOCName"
            value={contactFormData.SPOCName}
            onChange={handleContactInputChange}
            error={!!contactFormErrors.SPOCName}
            helperText={contactFormErrors.SPOCName}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email Address"
            name="Email"
            type="email"
            value={contactFormData.Email}
            onChange={handleContactInputChange}
            error={!!contactFormErrors.Email}
            helperText={contactFormErrors.Email}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Mobile Number"
            name="Mobile"
            value={contactFormData.Mobile}
            onChange={handleContactInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Tel Number"
            name="Tel"
            value={contactFormData.Tel}
            onChange={handleContactInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Remarks"
            name="Remarks"
            value={contactFormData.Remarks}
            onChange={handleContactInputChange}
            margin="normal"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setOpenContactModal(false)} variant="outlined" sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Button onClick={handleSaveContact} variant="contained" sx={{ borderRadius: 2 }}>
            {contactFormType === 'create' ? 'Add Contact' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      <ToastNotification 
        open={toast.open} 
        message={toast.message} 
        severity={toast.severity} 
        onClose={() => setToast({ ...toast, open: false })} 
      />
    </Dialog>
  );
}
