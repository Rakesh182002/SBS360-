import React, { useState, useEffect } from 'react';
import { 
  Box, Button, TextField, Grid, Dialog, DialogTitle, DialogContent, DialogActions, 
  Typography, FormControl, InputLabel, Select, MenuItem, Paper
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

import API from '../../../services/api';
import { FormDatePicker, Loader, ToastNotification } from '../../../components/ReusableComponents';

const ADJ_REASONS = [
  { value: 1, label: 'DataEntry Error' },
  { value: 2, label: 'Quality Check' },
  { value: 3, label: 'Damage' },
  { value: 4, label: 'Annual Adjustment' },
  { value: 5, label: 'Miscellaneous' }
];

const ADJ_TYPES = [
  { value: 1, label: 'Deduction' },
  { value: 2, label: 'Addition' }
];

export default function StockTakingFormDialog({ open, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [formErrors, setFormErrors] = useState({});

  // Dropdown lists
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [employees, setEmployees] = useState([]);

  // Live stock level state
  const [currentSystemStock, setCurrentSystemStock] = useState('0');
  const [fetchingStock, setFetchingStock] = useState(false);

  const initialFormState = {
    Stock_Taking_Number: '',
    StoreID: '',
    Branch_Name: 'City Construction Eng Pte Ltd', // Default value
    Product_Code: '',
    ProductID: '',
    Product_Name: '',
    Measuring_Unit: '',
    Quantity: '',
    ActualStock: '',
    AdjType: 1, // 1 = Deduction (Decrease), 2 = Addition (Increase)
    AdjReason: 1, // 1 = DataEntry Error
    Adj_Ref_Number: '',
    Adj_Ref_Date: '',
    Stock_Taking_Date: new Date().toLocaleDateString('en-CA'),
    Stock_Taken_By: '',
    Remarks: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  // Load select sources on open
  useEffect(() => {
    if (open) {
      fetchDropdowns();
      setFormErrors({});
      setCurrentSystemStock('0');
      setFormData(initialFormState);
    }
  }, [open]);

  // Fetch current stock dynamically when Store + Product are matched
  useEffect(() => {
    if (formData.StoreID && formData.ProductID) {
      fetchCurrentStock(formData.ProductID, formData.StoreID);
    } else {
      setCurrentSystemStock('0');
    }
  }, [formData.StoreID, formData.ProductID]);

  const fetchDropdowns = async () => {
    try {
      const [resStores, resProducts, resEmployees] = await Promise.all([
        API.get('/material/stores'),
        API.get('/products'),
        API.get('/employees')
      ]);
      setStores(resStores.data.data || []);
      setProducts(resProducts.data.data || []);
      setEmployees(resEmployees.data.data || []);
    } catch (error) {
      console.error('Failed to load dropdown sources:', error);
    }
  };

  const fetchCurrentStock = async (productId, storeId) => {
    setFetchingStock(true);
    try {
      const response = await API.get(`/material/stock/current?productId=${productId}&storeId=${storeId}`);
      setCurrentSystemStock(String(response.data.data.stock || 0));
    } catch (error) {
      console.error('Failed to fetch live stock level:', error);
    } finally {
      setFetchingStock(false);
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

  // OnProductEntry matching logic
  const handleProductCodeChange = (e) => {
    const code = e.target.value;
    setFormData(prev => ({ ...prev, Product_Code: code }));
  };

  const handleProductCodeBlur = () => {
    const code = formData.Product_Code.trim();
    if (!code) {
      clearProductFields();
      return;
    }

    const matchedProd = products.find(p => p.Product_Code && p.Product_Code.toLowerCase() === code.toLowerCase());
    if (matchedProd) {
      setFormData(prev => ({
        ...prev,
        ProductID: matchedProd.ProductID,
        Product_Name: matchedProd.Product_Name || '',
        Measuring_Unit: matchedProd.Measuring_Unit || 'Nos'
      }));
    } else {
      clearProductFields();
      setToast({ open: true, message: 'Product is not available!', severity: 'error' });
    }
  };

  const clearProductFields = () => {
    setFormData(prev => ({
      ...prev,
      ProductID: '',
      Product_Name: '',
      Measuring_Unit: '',
      Quantity: '',
      ActualStock: ''
    }));
    setCurrentSystemStock('0');
  };

  const handleSaveAdjustment = async (e) => {
    if (e) e.preventDefault();

    // Validations
    const errors = {};
    let isValid = true;

    if (!formData.StoreID) {
      errors.StoreID = 'Store selection is required.';
      isValid = false;
    }
    if (!formData.ProductID) {
      errors.ProductID = 'Product is required (match Product Code).';
      isValid = false;
    }
    if (!formData.Quantity) {
      errors.Quantity = 'Quantity is required.';
      isValid = false;
    } else if (parseInt(formData.Quantity, 10) <= 0) {
      errors.Quantity = 'Quantity must be greater than zero.';
      isValid = false;
    }
    if (!formData.Stock_Taken_By) {
      errors.Stock_Taken_By = 'Inspector employee is required.';
      isValid = false;
    }
    if (!formData.Adj_Ref_Number || !formData.Adj_Ref_Number.trim()) {
      errors.Adj_Ref_Number = 'Reference Number is required.';
      isValid = false;
    }
    if (!formData.Adj_Ref_Date) {
      errors.Adj_Ref_Date = 'Reference Date is required.';
      isValid = false;
    }

    if (!isValid) {
      setFormErrors(errors);
      return;
    }

    setLoading(true);
    try {
      await API.post('/material/stocktaking', formData);
      onSuccess('Stock adjustment logged successfully.');
    } catch (error) {
      setToast({
        open: true,
        message: error.message || 'An error occurred while saving stock adjustment.',
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
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 24px 48px rgba(0,0,0,0.15)'
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, pb: 1, fontSize: '1.25rem' }}>
          Add Stock Adjustment
        </DialogTitle>
        
        <DialogContent dividers sx={{ p: 3 }}>
          <Box component="form" noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  disabled
                  type="date"
                  label="Stock Taking Date"
                  name="Stock_Taking_Date"
                  value={formData.Stock_Taking_Date}
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
                <FormControl fullWidth>
                  <InputLabel id="reason-label">Adjustment Reason</InputLabel>
                  <Select
                    labelId="reason-label"
                    label="Adjustment Reason"
                    name="AdjReason"
                    value={formData.AdjReason}
                    onChange={handleInputChange}
                  >
                    {ADJ_REASONS.map(r => (
                      <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Reference Number"
                  name="Adj_Ref_Number"
                  value={formData.Adj_Ref_Number}
                  onChange={handleInputChange}
                  error={!!formErrors.Adj_Ref_Number}
                  helperText={formErrors.Adj_Ref_Number}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormDatePicker
                  required
                  label="Ref_Date"
                  value={formData.Adj_Ref_Date}
                  onChange={(val) => {
                    setFormData(prev => ({ ...prev, Adj_Ref_Date: val }));
                    if (formErrors.Adj_Ref_Date) {
                      setFormErrors(prev => ({ ...prev, Adj_Ref_Date: '' }));
                    }
                  }}
                  error={!!formErrors.Adj_Ref_Date}
                  helperText={formErrors.Adj_Ref_Date}
                  margin="none"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="adjtype-label">Adjustment Type</InputLabel>
                  <Select
                    labelId="adjtype-label"
                    label="Adjustment Type"
                    name="AdjType"
                    value={formData.AdjType}
                    onChange={handleInputChange}
                  >
                    {ADJ_TYPES.map(t => (
                      <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required error={!!formErrors.Stock_Taken_By}>
                  <InputLabel id="takenby-label">Stock Taken By</InputLabel>
                  <Select
                    labelId="takenby-label"
                    label="Stock Taken By"
                    name="Stock_Taken_By"
                    value={formData.Stock_Taken_By}
                    onChange={handleInputChange}
                  >
                    {employees.map(emp => (
                      <MenuItem key={emp.UserID} value={emp.UserID}>
                        {emp.FirstName} {emp.LastName || ''}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.Stock_Taken_By && <Typography variant="caption" color="error">{formErrors.Stock_Taken_By}</Typography>}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Remarks"
                  name="Remarks"
                  value={formData.Remarks}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>

            {/* Product Specifications & Live Stock Panel (Displayed when Store is selected) */}
            {formData.StoreID && (
              <>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, borderBottom: '2px solid', pb: 0.5, borderColor: 'primary.main', mt: 1 }}>
                  Product Selection & Live Balance
                </Typography>
                <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, bgcolor: 'action.hover' }}>
                  <Grid container spacing={2.5}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        label="Product Code"
                        value={formData.Product_Code}
                        onChange={handleProductCodeChange}
                        onBlur={handleProductCodeBlur}
                        placeholder="Type and blur to match product..."
                        error={!!formErrors.ProductID}
                        helperText={formErrors.ProductID || "Type code and click outside to fetch."}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        disabled
                        label="ProductID"
                        value={formData.ProductID}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        disabled
                        label="Product Name"
                        value={formData.Product_Name}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        disabled
                        label="UoM"
                        value={formData.Measuring_Unit}
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        disabled
                        label="Current System Stock"
                        value={fetchingStock ? 'Querying...' : `${currentSystemStock} ${formData.Measuring_Unit || 'Nos'}`}
                        InputProps={{ sx: { fontWeight: 700, color: 'text.secondary' } }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Actual Physical Stock Count"
                        name="ActualStock"
                        value={formData.ActualStock}
                        onChange={handleInputChange}
                        inputProps={{ min: 0 }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <TextField
                        required
                        fullWidth
                        type="number"
                        label="Quantity to be adjusted"
                        name="Quantity"
                        value={formData.Quantity}
                        onChange={handleInputChange}
                        error={!!formErrors.Quantity}
                        helperText={formErrors.Quantity}
                        inputProps={{ min: 1 }}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </>
            )}
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
            onClick={handleSaveAdjustment} 
            variant="contained" 
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
