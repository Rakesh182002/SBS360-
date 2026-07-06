import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Box, Card, CardContent, Typography, Button, Grid, 
  TableContainer, Table, TableRow, TableCell, TableBody, TableHead, Paper, Checkbox, FormControlLabel
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import API from '../../../services/api';
import { Loader, ToastNotification } from '../../../components/ReusableComponents';
import logo from '../../../assets/sbs360 logo.png';

export default function DttrDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [safety, setSafety] = useState(null);
  const [hazards, setHazards] = useState([]);
  const [ppes, setPpes] = useState([]);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchDropdownsAndDetails();
  }, [id]);

  const fetchDropdownsAndDetails = async () => {
    setLoading(true);
    try {
      const [resHazards, resPpes, resDetails] = await Promise.all([
        API.get('/safety/hazards'),
        API.get('/safety/ppes'),
        API.get(`/safety/${id}`)
      ]);
      setHazards(resHazards.data.data || []);
      setPpes(resPpes.data.data || []);
      setSafety(resDetails.data.data);
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


  // Group items for grid structures
  const chunkArray = (array, size) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  const hazardRows = chunkArray(hazards, 4);
  const ppeRows = chunkArray(ppes, 5);

  return (
    <Box sx={{ width: '100%' }}>
      <Loader open={loading} />

      <Box className="no-print" sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Daily Toolbox Talk Details
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant="outlined" 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate('/dttr')}
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Back
          </Button>
          
        </Box>
      </Box>

      {safety && (
        <Paper 
          elevation={0}
          sx={{ 
            p: 4, 
            border: '1px solid', 
            borderColor: 'divider', 
            borderRadius: 3,
            maxWidth: '900px',
            margin: '0 auto',
            backgroundColor: '#fff',
            color: '#000'
          }}
        >
          {/* Header Section */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 2, borderBottom: '2px solid #000', mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ width: '90px', height: '90px' }}>
                <img src={logo} alt="Company Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, fontSize: '1rem', lineHeight: '1.2' }}>
                  CITI CONSTRUCTION ENGINEERING PTE. LTD.
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', fontSize: '0.75rem', lineHeight: '1.4', color: '#444' }}>
                  36 Senoko Road, Singapore 758108<br />
                  Tel : (65) 6755 8600 / Fax: (65) 6755 8611<br />
                  E-mail : admin@citiconstruction.com.sg<br />
                  Co. Reg. No : 201212345M GST. Reg. No : 201212345M-01
                </Typography>
              </Box>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="body2" sx={{ fontWeight: 800, letterSpacing: 0.5, border: '2px solid #000', px: 1, py: 0.5, borderRadius: 1 }}>
                bizSafe Level 3
              </Typography>
            </Box>
          </Box>

          {/* Metadata Block Table */}
          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1, mb: 3, border: '1px solid #000' }}>
            <Table size="small" sx={{ '& td': { border: '1px solid #000', py: 1 } }}>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, width: '20%' }}>Name of Company:</TableCell>
                  <TableCell sx={{ width: '30%' }}>{safety.CompanyName || 'CITI CONSTRUCTION ENGINEERING PTE. LTD.'}</TableCell>
                  <TableCell sx={{ fontWeight: 700, width: '20%' }}>Report Date & Time:</TableCell>
                  <TableCell sx={{ width: '30%' }}>
                    {formatDate(safety.RepDate)} & {safety.RepTime ? safety.RepTime.substring(0, 5) : '-'}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Project Title:</TableCell>
                  <TableCell colSpan={3}>{safety.ProjectTitle || '-'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Location of Work:</TableCell>
                  <TableCell colSpan={2}>{safety.LocationOfWork || '-'}</TableCell>
                  <TableCell sx={{ fontStyle: 'italic', fontSize: '0.75rem' }}>(give all locations for todays work)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Supervisor Details:</TableCell>
                  <TableCell colSpan={3}>
                    {safety.SubmittedBy || '-'}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {/* Hazards Checklist Section */}
          <Typography variant="body2" sx={{ fontWeight: 800, mb: 1, fontSize: '0.85rem' }}>
            List of Hazards associated & identified in today's task & its corresponding RA & SWP reminded (Check the box)
          </Typography>
          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1, mb: 2, border: '1px solid #000' }}>
            <Table size="small" sx={{ '& td': { border: '1px solid #000', p: 1 } }}>
              <TableBody>
                {hazardRows.map((row, rIdx) => (
                  <TableRow key={rIdx}>
                    {row.map(h => {
                      const isChecked = safety.hazardList && safety.hazardList.includes(h.HazardID);
                      return (
                        <TableCell key={h.HazardID} sx={{ width: '25%', fontSize: '0.75rem' }}>
                          <FormControlLabel
                            control={<Checkbox checked={isChecked} size="small" disabled sx={{ color: '#000', '&.Mui-checked': { color: '#000' }, py: 0 }} />}
                            label={<span style={{ color: '#000', fontSize: '0.75rem' }}>{h.HazardDesc}</span>}
                            sx={{ m: 0 }}
                          />
                        </TableCell>
                      );
                    })}
                    {/* Padding cells */}
                    {row.length < 4 && Array.from({ length: 4 - row.length }).map((_, pIdx) => (
                      <TableCell key={`pad-${pIdx}`} sx={{ width: '25%' }} />
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {safety.OtherHazard && (
            <Box sx={{ mb: 2, border: '1px solid #000', p: 1.5, borderRadius: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>Any Other Hazard Details:</Typography>
              <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>{safety.OtherHazard}</Typography>
            </Box>
          )}

          {/* Additional Health Measures */}
          <Box sx={{ mb: 3, border: '1px solid #000', p: 1.5, borderRadius: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 800, mb: 0.5, fontSize: '0.85rem' }}>
              Additional Safety and Health Measures highlighted to comply, if any:
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                fontSize: '0.8rem', 
                minHeight: '40px',
                whiteSpace: 'pre-wrap'
              }}
            >
              {safety.ASHMeasures || 'None'}
            </Typography>
          </Box>

          {/* PPE Checklist Section */}
          <Typography variant="body2" sx={{ fontWeight: 800, mb: 1, fontSize: '0.85rem' }}>
            List of PPE Highlighted and reminded to comply (Check the box)
          </Typography>
          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1, mb: 3, border: '1px solid #000' }}>
            <Table size="small" sx={{ '& td': { border: '1px solid #000', p: 1 } }}>
              <TableBody>
                {ppeRows.map((row, rIdx) => (
                  <TableRow key={rIdx}>
                    {row.map(p => {
                      const isChecked = safety.ppeList && safety.ppeList.includes(p.PPEID);
                      return (
                        <TableCell key={p.PPEID} sx={{ width: '20%', fontSize: '0.75rem' }}>
                          <FormControlLabel
                            control={<Checkbox checked={isChecked} size="small" disabled sx={{ color: '#000', '&.Mui-checked': { color: '#000' }, py: 0 }} />}
                            label={<span style={{ color: '#000', fontSize: '0.75rem' }}>{p.PPE_Desc}</span>}
                            sx={{ m: 0 }}
                          />
                        </TableCell>
                      );
                    })}
                    {/* Padding cells */}
                    {row.length < 5 && Array.from({ length: 5 - row.length }).map((_, pIdx) => (
                      <TableCell key={`pad-${pIdx}`} sx={{ width: '20%' }} />
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Acknowledgement / Undertaking Block */}
          <Box sx={{ mb: 3, border: '1px solid #000', p: 1.5, borderRadius: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 800, mb: 0.5, fontSize: '0.85rem' }}>
              Acknowledgement and undertaking by employees attending this Toolbox Talk (Supervisor to highlight this)
            </Typography>
            <Typography variant="body2" sx={{ color: 'blue', fontSize: '0.8rem', fontStyle: 'italic' }}>
              We, the undersigned, herewith acknowledge that we have been already briefed on all necessary RA, SWP & MOS for 
              the variuos activities and reminded to us today as above. We undertake to comply all ncessary Safety & Health measures.
            </Typography>
          </Box>

          {/* Worker List Block */}
          <Typography variant="body2" sx={{ fontWeight: 800, mb: 1, fontSize: '0.85rem' }}>
            Worker List
          </Typography>
          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1, border: '1px solid #000' }}>
            <Table size="small" sx={{ '& th, & td': { border: '1px solid #000', py: 1 } }}>
              <TableHead>
                <TableRow sx={{ bgcolor: '#eee' }}>
                  <TableCell sx={{ fontWeight: 700, width: '10%', textAlign: 'center' }}>Sl No.</TableCell>
                  <TableCell sx={{ fontWeight: 700, width: '40%' }}>Name of Worker</TableCell>
                  <TableCell sx={{ fontWeight: 700, width: '25%' }}>WP / IC No</TableCell>
                  <TableCell sx={{ fontWeight: 700, width: '25%', textAlign: 'center' }}>Signature</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {safety.workerList && safety.workerList.length > 0 ? (
                  safety.workerList.map((emp, index) => (
                    <TableRow key={emp.UserID}>
                      <TableCell sx={{ textAlign: 'center' }}>{index + 1}</TableCell>
                      <TableCell>{emp.FullName}</TableCell>
                      <TableCell>{emp.ID_Number || '-'}</TableCell>
                      <TableCell />
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} sx={{ textAlign: 'center', py: 2 }}>
                      No workers assigned to this Toolbox Talk.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
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
