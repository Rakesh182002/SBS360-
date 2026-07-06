import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Box, Card, CardContent, Typography, Button, Grid, 
  TableContainer, Table, TableRow, TableCell, TableBody, Paper
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import API from '../../../services/api';
import { Loader, ToastNotification } from '../../../components/ReusableComponents';

const ADJ_REASONS_MAP = {
  1: 'DataEntry Error',
  2: 'Quality Check',
  3: 'Damage',
  4: 'Annual Adjustment',
  5: 'Miscellaneous'
};

const ADJ_TYPES_MAP = {
  1: 'Deduction',
  2: 'Addition'
};

export default function StockTakingDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [adjustment, setAdjustment] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchAdjustmentDetails();
  }, [id]);

  const fetchAdjustmentDetails = async () => {
    setLoading(true);
    try {
      const response = await API.get(`/material/stocktaking/${id}`);
      setAdjustment(response.data.data);
    } catch (error) {
      setToast({
        open: true,
        message: error.message || 'Failed to fetch stock adjustment details.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const parts = dateStr.substring(0, 10).split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Loader open={loading} />

      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Details of Stock Adjustment {adjustment ? `- ${adjustment.Stock_Taking_Number || `SAJ-${adjustment.StockAdjID}`}` : ''}
          </Typography>
        </Box>
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate('/stocktaking')}
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Back
          </Button>
        </Box>
      </Box>

      {adjustment && (
        <Grid container spacing={3}>
          {/* General Metadata */}
          <Grid item xs={12} md={7}>
            <Card sx={{ height: '100%', borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 700, mb: 2 }}>General Info</Typography>
                <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, width: '40%', bgcolor: 'action.hover' }}>Stock Taking Date</TableCell>
                        <TableCell sx={{ width: '60%' }}>{formatDate(adjustment.Stock_Taking_Date)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Store Name</TableCell>
                        <TableCell>{adjustment.Store_Name}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Company Name</TableCell>
                        <TableCell>{adjustment.Branch_Name || 'City Construction Eng Pte Ltd'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Adjustment Reason</TableCell>
                        <TableCell>{ADJ_REASONS_MAP[adjustment.AdjReason] || 'Correction'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Reference Number</TableCell>
                        <TableCell>{adjustment.Adj_Ref_Number || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Ref Date</TableCell>
                        <TableCell>{formatDate(adjustment.Adj_Ref_Date)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Adjustment Type</TableCell>
                        <TableCell>
                          <Typography component="span" variant="body2" sx={{
                            bgcolor: adjustment.AdjType === 1 ? 'error.main' + '20' : 'success.main' + '20',
                            color: adjustment.AdjType === 1 ? 'error.main' : 'success.main',
                            px: 1.5, py: 0.5, borderRadius: 1.5, fontWeight: 600
                          }}>
                            {ADJ_TYPES_MAP[adjustment.AdjType] || 'Adjustment'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Stock Taken By</TableCell>
                        <TableCell>{adjustment.Stock_Taken_By_Name || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Remarks</TableCell>
                        <TableCell>{adjustment.Remarks || '-'}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Product Adjustment Details */}
          <Grid item xs={12} md={5}>
            <Card sx={{ height: '100%', borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 700, mb: 2 }}>Product Specifications</Typography>
                <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, width: '45%', bgcolor: 'action.hover' }}>Product Code</TableCell>
                        <TableCell sx={{ width: '55%' }}>{adjustment.Product_Code || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Product Name</TableCell>
                        <TableCell>{adjustment.Product_Name || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>UoM</TableCell>
                        <TableCell>{adjustment.UoM || 'Nos'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Actual Stock Count</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>
                          {adjustment.ActualStock !== null ? parseInt(adjustment.ActualStock, 10).toLocaleString() : '-'}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Quantity Adjusted</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: adjustment.AdjType === 1 ? 'error.main' : 'success.main' }}>
                          {adjustment.AdjType === 1 ? '-' : '+'}{parseInt(adjustment.Quantity, 10).toLocaleString()}
                        </TableCell>
                      </TableRow>
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
    </Box>
  );
}
