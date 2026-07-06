import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box, Card, CardContent, Typography, Button, Grid,
  TableContainer, Table, TableRow, TableCell, TableBody, Paper
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import API, { API_BASE_URL } from '../../../services/api';
import { Loader, ToastNotification } from '../../../components/ReusableComponents';

export default function EhsDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [inspection, setInspection] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });




  useEffect(() => {
    fetchEmployeesAndDetails();
  }, [id]);

  const fetchEmployeesAndDetails = async () => {
    setLoading(true);
    try {
      const [resEmployees, resDetails] = await Promise.all([
        API.get('/employees'),
        API.get(`/safety/esh/${id}`)
      ]);
      setEmployees(resEmployees.data.data || []);
      setInspection(resDetails.data.data);
    } catch (error) {
      setToast({
        open: true,
        message: error.message || 'Failed to fetch details.',
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

  const getInspectorName = (empId) => {
    if (!empId) return '-';
    const emp = employees.find(e => e.UserID === parseInt(empId, 10));
    return emp ? `${emp.FirstName} ${emp.LastName || ''}`.trim() : `Employee #${empId}`;
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Loader open={loading} />

      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Details of EHS Inspection {inspection ? `#${inspection.NSIID}` : ''}
          </Typography>
        </Box>
        <Box>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/safetyinspectionnew')}
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Back
          </Button>
        </Box>
      </Box>

      {inspection && (
        <Grid container spacing={3}>
          {/* General Metadata */}
          <Grid item xs={12} md={7}>
            <Card sx={{ height: '100%', borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 700, mb: 2 }}>Inspection Audit Info</Typography>
                <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, width: '40%', bgcolor: 'action.hover' }}>Project Name</TableCell>
                        <TableCell sx={{ width: '60%' }}>{inspection.ProjectName || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Inspection Date</TableCell>
                        <TableCell>{formatDate(inspection.InspectionDate)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Project Location</TableCell>
                        <TableCell>{inspection.ProjectLocation || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Inspected By</TableCell>
                        <TableCell>{getInspectorName(inspection.InspectedBy)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Observation details</TableCell>
                        <TableCell>{inspection.Observation || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Remedial Action Required</TableCell>
                        <TableCell>{inspection.RemedialAction || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Action By / Deadline</TableCell>
                        <TableCell>{inspection.ActionBy_Deadline || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Rectification Remarks</TableCell>
                        <TableCell>{inspection.Rectification_Remarks || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>EHS Officer Name</TableCell>
                        <TableCell>{inspection.EHSName || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Acknowledged By</TableCell>
                        <TableCell>{inspection.AcknowlegeBy || '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'action.hover' }}>Status</TableCell>
                        <TableCell>
                          <Typography component="span" variant="body2" sx={{
                            bgcolor: inspection.Status === 'Completed' || inspection.Status === 'Confirmed' ? 'success.main' + '20' : 'warning.main' + '20',
                            color: inspection.Status === 'Completed' || inspection.Status === 'Confirmed' ? 'success.main' : 'warning.main',
                            px: 1.5, py: 0.5, borderRadius: 1.5, fontWeight: 600
                          }}>
                            {inspection.Status || 'Pending'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Image preview / attachments */}
          <Grid item xs={12} md={5}>
            <Card sx={{ height: '100%', borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 700, mb: 2 }}>Attachment Preview</Typography>
                {inspection.FilePath ? (
                  <Box sx={{ width: '100%', textAlign: 'center' }}>
                    {inspection.FileName ? (
                      <img
                        src={`${API_BASE_URL}${inspection.FilePath}`}
                        alt="EHS Audit Observation"
                        style={{ maxWidth: '100%', borderRadius: 8, border: '1px solid #ddd' }}
                      />
                    ) : (
                      <Button
                        variant="contained"
                        href={`${API_BASE_URL}+${inspection.FilePath}`}
                        target="_blank"
                        sx={{ textTransform: 'none', borderRadius: 2 }}
                      >
                        Download Attachment File
                      </Button>
                    )}
                    <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
                      {inspection.FileName}
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ p: 4, textAlign: 'center', bgcolor: 'action.hover', borderRadius: 2, border: '1px dashed', borderColor: 'divider' }}>
                    <Typography variant="body2" color="text.secondary">No attachment provided for this report.</Typography>
                  </Box>
                )}
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
