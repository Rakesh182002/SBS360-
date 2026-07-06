import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box, Card, CardContent, Typography, Button, Grid,
  TableContainer, Table, TableRow, TableCell, TableBody, TableHead, Paper
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import API from '../../../services/api';
import { Loader, ToastNotification } from '../../../components/ReusableComponents';

const STATUS_MAP = {
  1: 'Yes',
  2: 'No',
  3: 'N/A'
};

export default function SafetyInspectionDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [inspection, setInspection] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchInspectionDetails();
  }, [id]);

  const fetchInspectionDetails = async () => {
    setLoading(true);
    try {
      const response = await API.get(`/safety/inspections/${id}`);
      setInspection(response.data.data);
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

  // Group items by section
  const sections = {};
  if (inspection && inspection.details) {
    inspection.details.forEach(item => {
      const sec = item.SectionName || 'General';
      if (!sections[sec]) sections[sec] = [];
      sections[sec].push(item);
    });
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Loader open={loading} />

      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Details of Safety Inspection {inspection ? `#${inspection.SafetyRefNum || inspection.SAFINSID}` : ''}
          </Typography>
        </Box>
        <Box>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/safetyinspection')}
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Back
          </Button>
        </Box>
      </Box>

      {inspection && (
        <Grid container spacing={3}>
          {/* General Metadata */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 700, mb: 2 }}>Inspection Header</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="caption" color="text.secondary">Safety Ref No.</Typography>
                    <Typography sx={{ fontWeight: 600 }}>{inspection.SafetyRefNum || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="caption" color="text.secondary">Project Name</Typography>
                    <Typography sx={{ fontWeight: 600 }}>{inspection.ProjectName || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="caption" color="text.secondary">Inspection Date</Typography>
                    <Typography sx={{ fontWeight: 600 }}>{formatDate(inspection.SIDate)}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="caption" color="text.secondary">Inspected By</Typography>
                    <Typography sx={{ fontWeight: 600 }}>{inspection.InspectedBy || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="caption" color="text.secondary">Project Location</Typography>
                    <Typography sx={{ fontWeight: 600 }}>{inspection.ProjectLocation || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="caption" color="text.secondary">Address</Typography>
                    <Typography sx={{ fontWeight: 600 }}>{inspection.Address || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="caption" color="text.secondary">Safety Cert Info</Typography>
                    <Typography sx={{ fontWeight: 600 }}>{inspection.Safety_Cert_Info || '-'}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Checklist */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 700, mb: 3 }}>Inspection Checklist details</Typography>

                {Object.keys(sections).map(sectionTitle => (
                  <Box key={sectionTitle} sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, bgcolor: 'action.hover', p: 1.5, borderRadius: 2, mb: 2 }}>
                      {sectionTitle}
                    </Typography>
                    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                      <Table size="small">
                        <TableHead sx={{ bgcolor: 'action.selected' }}>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 700, width: '45%' }}>Item Description</TableCell>
                            <TableCell sx={{ fontWeight: 700, width: '15%' }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 700, width: '20%' }}>Recommendation</TableCell>
                            <TableCell sx={{ fontWeight: 700, width: '10%' }}>Responsible Person</TableCell>
                            <TableCell sx={{ fontWeight: 700, width: '10%' }}>Deadline</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {sections[sectionTitle].map(item => (
                            <TableRow key={item.SIDetailID} hover>
                              <TableCell>{item.SIItemDesc}</TableCell>
                              <TableCell>
                                <Typography component="span" variant="body2" sx={{
                                  bgcolor: item.Is_Applicable === 1 ? 'success.main' + '15' : item.Is_Applicable === 2 ? 'error.main' + '15' : 'action.selected',
                                  color: item.Is_Applicable === 1 ? 'success.main' : item.Is_Applicable === 2 ? 'error.main' : 'text.secondary',
                                  px: 1.25, py: 0.5, borderRadius: 1, fontWeight: 600
                                }}>
                                  {STATUS_MAP[item.Is_Applicable] || '-'}
                                </Typography>
                              </TableCell>
                              <TableCell>{item.Recommendation || '-'}</TableCell>
                              <TableCell>{item.ResponsiblePerson || '-'}</TableCell>
                              <TableCell>{formatDate(item.ACDate)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                ))}
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
