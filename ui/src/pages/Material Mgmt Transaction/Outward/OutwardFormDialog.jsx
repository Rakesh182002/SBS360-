import React, { useState, useEffect } from 'react';
import { 
  Box, Button, TextField, Grid, Dialog, DialogTitle, DialogContent, DialogActions, 
  Typography, FormControl, InputLabel, Select, MenuItem, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Paper, IconButton
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

import API from '../../../services/api';
import { FormDatePicker, Loader, ToastNotification } from '../../../components/ReusableComponents';

const OUTWARD_TYPES = [
  { value: 1, label: 'Delivery Order' },
  { value: 2, label: 'Transfer Order' },
  { value: 3, label: 'Return Order' },
  { value: 4, label: 'Material Request' },
  { value: 5, label: 'Miscellaneous' }
];

export default function OutwardFormDialog({ open, onClose, outwardId, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [formErrors, setFormErrors] = useState({});

  // Dropdown lists
  const [stores, setStores] = useState([]);
  const [clients, setClients] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [products, setProducts] = useState([]);

  // Outward Metadata Form State
  const initialOutwardState = {
    Outward_Number: '',
    StoreID: '',
    Branch_Name: 'City Construction Eng Pte Ltd', // Default value matching legacy code dropdown
    ClientID: '',
    DO_Number: '',
    DO_Date: '',
    Outward_Type: 1,
    Delivery_Date: new Date().toLocaleDateString('en-CA'),
    Vehicle_Number: '',
    Delivery_Mode: '',
    Project_Location: '',
    DeliveredBy: '',
    DraftFlag: 0
  };

  const [formData, setFormData] = useState(initialOutwardState);

  // Active Specifications Items List
  const [items, setItems] = useState([]);

  // Product Entry Form fields (the row editor area on top of the list)
  const [productEntry, setProductEntry] = useState({
    Product_Code: '',
    ProductID: '',
    Description: '',
    UoM: '',
    Quantity: '0',
    Remarks: ''
  });

  // Load dropdown lists on mount
  useEffect(() => {
    if (open) {
      fetchDropdowns();
      setFormErrors({});
      clearProductEntry();
      if (outwardId) {
        fetchOutwardDetails();
      } else {
        setFormData(initialOutwardState);
        setItems([]);
      }
    }
  }, [open, outwardId]);

  const fetchDropdowns = async () => {
    try {
      const [resStores, resClients, resEmployees, resProducts] = await Promise.all([
        API.get('/material/stores'),
        API.get('/clients'),
        API.get('/employees'),
        API.get('/products')
      ]);
      setStores(resStores.data.data || []);
      setClients(resClients.data.data || []);
      setEmployees(resEmployees.data.data || []);
      setProducts(resProducts.data.data || []);
    } catch (error) {
      console.error('Failed to load dropdown sources:', error);
    }
  };

  const fetchOutwardDetails = async () => {
    setLoading(true);
    try {
      const response = await API.get(`/material/outwards/${outwardId}`);
      const ouw = response.data.data;
      
      let formattedDODate = '';
      if (ouw.DO_Date) {
        formattedDODate = ouw.DO_Date.substring(0, 10);
      }
      
      let formattedDelDate = '';
      if (ouw.Delivery_Date) {
        formattedDelDate = ouw.Delivery_Date.substring(0, 10);
      }

      setFormData({
        Outward_ID: ouw.Outward_ID,
        Outward_Number: ouw.Outward_Number || '',
        StoreID: ouw.StoreID || '',
        Branch_Name: ouw.Branch_Name || 'City Construction Eng Pte Ltd',
        ClientID: ouw.ClientID || '',
        DO_Number: ouw.DO_Number || '',
        DO_Date: formattedDODate,
        Outward_Type: ouw.Outward_Type || 1,
        Delivery_Date: formattedDelDate,
        Vehicle_Number: ouw.Vehicle_Number || '',
        Delivery_Mode: ouw.Delivery_Mode || '',
        Project_Location: ouw.Project_Location || '',
        DeliveredBy: ouw.DeliveredBy || '',
        DraftFlag: ouw.DraftFlag !== null ? ouw.DraftFlag : 0
      });

      if (ouw.items && ouw.items.length > 0) {
        setItems(ouw.items.map(item => ({
          OutDescID: item.OutDescID,
          Product_Code: item.Product_Code,
          ProductID: item.ProductID,
          Description: item.Product_Name || item.Remarks,
          UoM: item.UoM || 'Nos',
          Quantity: item.Quantity || 0,
          Remarks: item.Remarks || ''
        })));
      } else {
        setItems([]);
      }
    } catch (error) {
      setToast({
        open: true,
        message: error.message || 'Failed to fetch outward details.',
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

  // OnProductEntry helper: Matches typed code with all products
  const handleProductEntryCodeChange = (e) => {
    const code = e.target.value;
    setProductEntry(prev => ({ ...prev, Product_Code: code }));
  };

  const handleProductEntryCodeBlur = () => {
    const code = productEntry.Product_Code.trim();
    if (!code) {
      clearProductEntry();
      return;
    }

    const matchedProd = products.find(p => p.Product_Code && p.Product_Code.toLowerCase() === code.toLowerCase());
    if (matchedProd) {
      setProductEntry(prev => ({
        ...prev,
        ProductID: matchedProd.ProductID,
        Description: matchedProd.Product_Description || matchedProd.Product_Name || '',
        UoM: matchedProd.Measuring_Unit || 'Nos'
      }));
    } else {
      clearProductEntry();
      setToast({ open: true, message: 'Product is not available!', severity: 'error' });
    }
  };

  const clearProductEntry = () => {
    setProductEntry({
      Product_Code: '',
      ProductID: '',
      Description: '',
      UoM: '',
      Quantity: '0',
      Remarks: ''
    });
  };

  const handleProductEntryInputChange = (e) => {
    const { name, value } = e.target;
    setProductEntry(prev => ({ ...prev, [name]: value }));
  };

  // Add Product to specifications table
  const handleAddProduct = () => {
    const code = productEntry.Product_Code.trim();
    const pid = productEntry.ProductID;
    const qty = parseInt(productEntry.Quantity, 10);
    const uom = productEntry.UoM;
    const desc = productEntry.Description;
    const rem = productEntry.Remarks;

    if (!code || !pid) {
      setToast({ open: true, message: 'Please select a valid product first.', severity: 'warning' });
      return;
    }

    if (isNaN(qty) || qty <= 0) {
      setToast({ open: true, message: 'Pls enter Quantity > 0 value', severity: 'warning' });
      return;
    }

    setItems(prev => [
      ...prev,
      {
        Product_Code: code,
        ProductID: pid,
        Description: desc,
        UoM: uom,
        Quantity: qty,
        Remarks: rem
      }
    ]);

    clearProductEntry();
  };

  const handleRemoveProductRow = (index) => {
    setItems(prev => prev.filter((_, idx) => idx !== index));
  };

  const submitForm = async (draftFlagValue) => {
    const errors = {};
    let isValid = true;

    if (!formData.StoreID) {
      errors.StoreID = 'Store is required.';
      isValid = false;
    }
    if (!formData.ClientID) {
      errors.ClientID = 'Client is required.';
      isValid = false;
    }
    if (!formData.DeliveredBy) {
      errors.DeliveredBy = 'Delivered By employee is required.';
      isValid = false;
    }
    if (!formData.Project_Location || !formData.Project_Location.trim()) {
      errors.Project_Location = 'Project Location is required.';
      isValid = false;
    }
    if (!formData.Delivery_Mode || !formData.Delivery_Mode.trim()) {
      errors.Delivery_Mode = 'Delivery Mode is required.';
      isValid = false;
    }

    if (items.length === 0) {
      setToast({ open: true, message: 'You must add at least one product description.', severity: 'error' });
      return;
    }

    if (!isValid) {
      setFormErrors(errors);
      return;
    }

    setLoading(true);
    const payload = {
      ...formData,
      DraftFlag: draftFlagValue,
      outwardDescription: items
    };

    try {
      if (outwardId) {
        await API.put(`/material/outwards/${outwardId}`, payload);
        onSuccess(draftFlagValue === 1 ? 'Outward transaction created successfully.' : 'Outward draft saved successfully.');
      } else {
        await API.post('/material/outwards', payload);
        onSuccess(draftFlagValue === 1 ? 'Outward transaction created successfully.' : 'Outward draft saved successfully.');
      }
    } catch (error) {
      setToast({
        open: true,
        message: error.message || 'An error occurred while saving outward transaction.',
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
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 24px 48px rgba(0,0,0,0.15)'
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, pb: 1, fontSize: '1.25rem' }}>
          {outwardId ? 'Edit Outward Details' : 'Add New Outward'}
        </DialogTitle>
        
        <DialogContent dividers sx={{ p: 3 }}>
          <Box component="form" noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
            
            {/* Metadata Fields Section */}
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  disabled
                  type="date"
                  label="Delivery Date"
                  name="Delivery_Date"
                  value={formData.Delivery_Date}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required error={!!formErrors.StoreID}>
                  <InputLabel id="store-label">Store</InputLabel>
                  <Select
                    labelId="store-label"
                    label="Store"
                    name="StoreID"
                    value={formData.StoreID}
                    onChange={handleInputChange}
                  >
                    {stores.map(s => (
                      <MenuItem key={s.StoreID} value={s.StoreID}>
                        {s.Store_Name} ({s.Store_Code || 'N/A'})
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.StoreID && <Typography variant="caption" color="error">{formErrors.StoreID}</Typography>}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="branch-label">Company Name</InputLabel>
                  <Select
                    labelId="branch-label"
                    label="Company Name"
                    name="Branch_Name"
                    value={formData.Branch_Name}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="City Construction Eng Pte Ltd">City Construction Eng Pte Ltd</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required error={!!formErrors.ClientID}>
                  <InputLabel id="client-label">Client</InputLabel>
                  <Select
                    labelId="client-label"
                    label="Client"
                    name="ClientID"
                    value={formData.ClientID}
                    onChange={handleInputChange}
                  >
                    {clients.map(c => (
                      <MenuItem key={c.ClientID} value={c.ClientID}>
                        {c.Company_Name}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.ClientID && <Typography variant="caption" color="error">{formErrors.ClientID}</Typography>}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="outwardtype-label">Outward Type</InputLabel>
                  <Select
                    labelId="outwardtype-label"
                    label="Outward Type"
                    name="Outward_Type"
                    value={formData.Outward_Type}
                    onChange={handleInputChange}
                  >
                    {OUTWARD_TYPES.map(t => (
                      <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="DO Number"
                  name="DO_Number"
                  value={formData.DO_Number}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormDatePicker
                  required
                  label="DO Date"
                  value={formData.DO_Date}
                  onChange={(val) => {
                    setFormData(prev => ({ ...prev, DO_Date: val }));
                    if (formErrors.DO_Date) {
                      setFormErrors(prev => ({ ...prev, DO_Date: '' }));
                    }
                  }}
                  error={!!formErrors.DO_Date}
                  helperText={formErrors.DO_Date}
                  margin="none"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required error={!!formErrors.DeliveredBy}>
                  <InputLabel id="deliveredby-label">Delivered By</InputLabel>
                  <Select
                    labelId="deliveredby-label"
                    label="Delivered By"
                    name="DeliveredBy"
                    value={formData.DeliveredBy}
                    onChange={handleInputChange}
                  >
                    {employees.map(emp => (
                      <MenuItem key={emp.UserID} value={emp.UserID}>
                        {emp.FirstName} {emp.LastName || ''}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.DeliveredBy && <Typography variant="caption" color="error">{formErrors.DeliveredBy}</Typography>}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  label="Project Location"
                  name="Project_Location"
                  value={formData.Project_Location}
                  onChange={handleInputChange}
                  error={!!formErrors.Project_Location}
                  helperText={formErrors.Project_Location}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  label="Delivery Mode"
                  name="Delivery_Mode"
                  value={formData.Delivery_Mode}
                  onChange={handleInputChange}
                  error={!!formErrors.Delivery_Mode}
                  helperText={formErrors.Delivery_Mode}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Vehicle Number"
                  name="Vehicle_Number"
                  value={formData.Vehicle_Number}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>

            {/* Product Entry Form Area (Matches Legacy Table Design) */}
            <Typography variant="subtitle1" sx={{ fontWeight: 700, borderBottom: '2px solid', pb: 0.5, borderColor: 'primary.main' }}>
              Product Entry Panel
            </Typography>
            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, bgcolor: 'action.hover' }}>
              <Grid container spacing={2} alignItems="flex-end">
                <Grid item xs={12} sm={2}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Product Code"
                    value={productEntry.Product_Code}
                    onChange={handleProductEntryCodeChange}
                    onBlur={handleProductEntryCodeBlur}
                    placeholder="Type code..."
                  />
                </Grid>
                <Grid item xs={12} sm={1.5}>
                  <TextField
                    fullWidth
                    disabled
                    size="small"
                    label="ProductID"
                    value={productEntry.ProductID}
                  />
                </Grid>
                <Grid item xs={12} sm={3.5}>
                  <TextField
                    fullWidth
                    disabled
                    size="small"
                    label="Description"
                    value={productEntry.Description}
                  />
                </Grid>
                <Grid item xs={12} sm={1.5}>
                  <TextField
                    fullWidth
                    disabled
                    size="small"
                    label="UoM"
                    value={productEntry.UoM}
                  />
                </Grid>
                <Grid item xs={12} sm={1.5}>
                  <TextField
                    fullWidth
                    size="small"
                    type="number"
                    label="Quantity"
                    name="Quantity"
                    value={productEntry.Quantity}
                    onChange={handleProductEntryInputChange}
                    inputProps={{ min: 0 }}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Remarks"
                    name="Remarks"
                    value={productEntry.Remarks}
                    onChange={handleProductEntryInputChange}
                  />
                </Grid>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                  <Button 
                    variant="contained" 
                    startIcon={<AddIcon />} 
                    size="small" 
                    onClick={handleAddProduct}
                    sx={{ textTransform: 'none', borderRadius: 1.5 }}
                  >
                    Add Product
                  </Button>
                </Grid>
              </Grid>
            </Paper>

            {/* List Table of specifications added */}
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Outward Specifications Grid
            </Typography>
            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: 'action.selected' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Product Code</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>ProductID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>UoM</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Quantity</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Remarks</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '5%', textAlign: 'center' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} sx={{ textAlign: 'center', py: 3, color: 'text.secondary' }}>
                        No product items added yet. Use the entry panel above.
                      </TableCell>
                    </TableRow>
                  ) : (
                    items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.Product_Code}</TableCell>
                        <TableCell>{item.ProductID}</TableCell>
                        <TableCell>{item.Description}</TableCell>
                        <TableCell>{item.UoM}</TableCell>
                        <TableCell>{item.Quantity}</TableCell>
                        <TableCell>{item.Remarks || '-'}</TableCell>
                        <TableCell sx={{ textAlign: 'center' }}>
                          <IconButton 
                            color="error" 
                            size="small" 
                            onClick={() => handleRemoveProductRow(index)}
                            sx={{ 
                              bgcolor: 'error.main' + '10',
                              '&:hover': { bgcolor: 'error.main', color: '#fff' }
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2.5 }}>
          <Button 
            onClick={onClose} 
            variant="outlined" 
            sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}
          >
            Back
          </Button>
          <Button 
            onClick={() => submitForm(0)} 
            variant="contained" 
            color="warning"
            sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}
          >
            Save Draft
          </Button>
          <Button 
            onClick={() => submitForm(1)} 
            variant="contained" 
            color="primary"
            startIcon={<SaveIcon />}
            sx={{ borderRadius: 2, textTransform: 'none', px: 4 }}
          >
            Create
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
