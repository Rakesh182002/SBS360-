import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Paper, Divider, Grid } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PrintIcon from '@mui/icons-material/Print';

import API from '../../../services/api';
import { Loader } from '../../../components/ReusableComponents';

export default function PtwDetails() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const ptwType = searchParams.get('type') || '';
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [ptw, setPtw] = useState(null);

  const isConfined = ptwType === 'PTWCONSPC' || ptwType === 'Confined Space Permit';

  useEffect(() => {
    fetchDetails();
  }, [id, ptwType]);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const response = await API.get(`/safety/ptw/details/${id}?type=${ptwType}`);
      setPtw(response.data.data);
    } catch (error) {
      console.error('Failed to load permit details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <Loader open={true} />;
  if (!ptw) return <Typography sx={{ p: 3 }}>No permit details found.</Typography>;

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      {/* Action Bar (hidden during printing) */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3,
        '@media print': { display: 'none' }
      }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/ptw')}
          variant="outlined"
          sx={{ borderRadius: 2, textTransform: 'none' }}
        >
          Back to Permits
        </Button>
        <Button
          startIcon={<PrintIcon />}
          onClick={handlePrint}
          variant="contained"
          sx={{ borderRadius: 2, textTransform: 'none' }}
        >
          Print Permit
        </Button>
      </Box>

      {/* Main Print Form Container */}
      <Paper elevation={0} sx={{
        width: '810px',
        margin: '0 auto',
        p: 4,
        border: '1px solid #ccc',
        fontFamily: 'Book Antiqua, Georgia, serif',
        color: '#000',
        bgcolor: '#fff',
        '@media print': {
          border: 'none',
          p: 0,
          width: '100%',
          margin: 0
        }
      }}>
        {/* Header Layout */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box
              component="img"
              src="/assets/logo2-2422f454.png"
              alt="SBS360 Logo"
              sx={{ width: 100, height: 100, objectFit: 'contain' }}
              onError={(e) => {
                e.target.src = '/assets/sbs360 logo-35ca3123.png';
              }}
            />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '15px' }}>
                CITI CONSTRUCTION & ENGINEERING PTE. LTD.
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '11px', lineHeight: 1.3 }}>
                10 Bukit Batok Crescent #05-09, The Spire, Singapore 658079<br />
                Tel: (65) 6570 0567 / Fax: (65) 6570 0568<br />
                Email: safety@citiconstruction.com.sg<br />
                Co. Reg. No: 201211029D GST Reg. No: 201211029D-G
              </Typography>
            </Box>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Box
              component="img"
              src="/assets/biz3.png"
              alt="bizSAFE"
              sx={{ width: 150, height: 60, objectFit: 'contain' }}
              onError={(e) => {
                e.style.display = 'none';
              }}
            />
          </Box>
        </Box>

        <Divider sx={{ borderColor: '#000', borderWidth: 1.5, mb: 2 }} />

        {/* PERMIT TITLE */}
        <Box sx={{ border: '2px solid #000', py: 1.5, mb: 2, textAlign: 'center', bgcolor: '#f5f5f5' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', fontSize: '20px', letterSpacing: '0.5px' }}>
            {isConfined ? 'CONFINED SPACE PERMIT TO WORK' : (
              ptwType === 'PTWWAH' ? 'PERMIT TO WORK FOR WORK AT HEIGHT' :
              ptwType === 'PTWWFEX' ? 'PERMIT TO WORK FOR / IN EXCAVATION' :
              ptwType === 'PTWHOT' ? 'PERMIT TO WORK FOR HOT WORKS' :
              ptwType === 'PTWLOPT' ? 'PERMIT TO WORK FOR LIFTING OPERATIONS' :
              'SAFETY PERMIT TO WORK'
            )}
          </Typography>
        </Box>

        {isConfined && (
          <Box sx={{ border: '1px solid #000', p: 1.5, mb: 2, fontSize: '11px', lineHeight: 1.4 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '11px', mb: 0.5 }}>IMPORTANT RULES:</Typography>
            • This permit is valid for a maximum of 7 days from the period stated at Stage 1 and for the same location only.<br />
            • The conditions of issue must be complied with throughout the duration of the work.<br />
            • This permit will be void/revoked in the event of non-compliance. To resume, a new permit must be submitted.<br />
            • <strong>Gas testing should be carried out minimum every 4 hours.</strong>
          </Box>
        )}

        {/* STAGE 1: APPLICATION */}
        <Box sx={{ border: '1px solid #000', mb: 2.5 }}>
          <Box sx={{ bgcolor: '#eee', p: 0.8, borderBottom: '1px solid #000' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', fontSize: '12px' }}>
              STAGE 1: APPLICATION BY SUPERVISOR IN-CHARGE
            </Typography>
          </Box>
          <Grid container sx={{ fontSize: '12px' }}>
            <Grid item xs={4} sx={{ p: 1, borderRight: '1px solid #000', borderBottom: '1px solid #000' }}>
              <strong>Company/Contractor Name:</strong><br />{ptw.CompanyName || ptw.ContractorName || '-'}
            </Grid>
            <Grid item xs={8} sx={{ p: 1, borderBottom: '1px solid #000' }}>
              <strong>Project Title:</strong><br />{ptw.ProjectTitle || '-'}
            </Grid>
            <Grid item xs={4} sx={{ p: 1, borderRight: '1px solid #000', borderBottom: '1px solid #000' }}>
              <strong>Name of Applicant:</strong><br />{ptw.NameOfApplicant || ptw.Applicant_Name || '-'}
            </Grid>
            <Grid item xs={4} sx={{ p: 1, borderRight: '1px solid #000', borderBottom: '1px solid #000' }}>
              <strong>Date & Time of Permit:</strong><br />{ptw.Date_Time ? new Date(ptw.Date_Time).toLocaleString() : ptw.Applicant_Date_Time ? new Date(ptw.Applicant_Date_Time).toLocaleString() : '-'}
            </Grid>
            <Grid item xs={4} sx={{ p: 1, borderBottom: '1px solid #000' }}>
              <strong>Sub-con Name:</strong><br />{ptw.Sub_con_Name || 'N/A'}
            </Grid>
            <Grid item xs={12} sx={{ p: 1, borderBottom: '1px solid #000' }}>
              <strong>Location of Work / Grid Line No:</strong><br />{ptw.Loc_or_GridLineNo || ptw.LocationOfWork || '-'}
            </Grid>
            <Grid item xs={4} sx={{ p: 1, borderRight: '1px solid #000' }}>
              <strong>Date & Time of Start:</strong><br />{ptw.Start_Date_Time ? new Date(ptw.Start_Date_Time).toLocaleString() : '-'}
            </Grid>
            <Grid item xs={4} sx={{ p: 1, borderRight: '1px solid #000' }}>
              <strong>Date & Time of End:</strong><br />{ptw.End_Date_Time ? new Date(ptw.End_Date_Time).toLocaleString() : '-'}
            </Grid>
            <Grid item xs={4} sx={{ p: 1 }}>
              <strong>No. of Workers Involved:</strong><br />{ptw.No_of_workers_involved || ptw.workers?.length || 0}
            </Grid>
          </Grid>
        </Box>

        {/* CONFINED WATCHMAN SECTION */}
        {isConfined && (
          <Box sx={{ border: '1px solid #000', mb: 2.5 }}>
            <Box sx={{ bgcolor: '#eee', p: 0.8, borderBottom: '1px solid #000' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', fontSize: '12px' }}>
                CONFINED SPACE WATCHMAN DETAILS
              </Typography>
            </Box>
            <Grid container sx={{ fontSize: '12px' }}>
              <Grid item xs={4} sx={{ p: 1, borderRight: '1px solid #000' }}>
                <strong>Watchman Name:</strong><br />{ptw.Stage1_Watchman_Name || '-'}
              </Grid>
              <Grid item xs={4} sx={{ p: 1, borderRight: '1px solid #000' }}>
                <strong>Watchman ID / Permit:</strong><br />{ptw.Stage1_Watchman_ID || '-'}
              </Grid>
              <Grid item xs={4} sx={{ p: 1 }}>
                <strong>Watchman Company:</strong><br />{ptw.Stage1_Watchman_Company || '-'}
              </Grid>
            </Grid>
          </Box>
        )}

        {/* CHECKLIST ITEMS */}
        <Box sx={{ mb: 2.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, fontSize: '12px' }}>
            SAFETY CHECKLIST & CONTROLS IMPLEMENTED
          </Typography>
          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 0, borderColor: '#000' }}>
            <Table size="small">
              <TableHead sx={{ bgcolor: '#eee' }}>
                <TableRow>
                  <TableCell sx={{ borderRight: '1px solid #000', borderBottom: '1px solid #000', color: '#000', fontWeight: 'bold', width: '80%' }}>Safety Requirements Checklist</TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #000', color: '#000', fontWeight: 'bold', width: '20%', textAlign: 'center' }}>Response</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ptw.details?.map((item) => (
                  <TableRow key={item.PTW_Stage_One_ID}>
                    <TableCell sx={{ borderRight: '1px solid #000', borderBottom: '1px solid #000', fontSize: '11px', py: 0.5 }}>{item.item || item.Item}</TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #000', fontSize: '11px', textAlign: 'center', py: 0.5 }}>
                      {(item.Is_Applicable || item.Is_Applicable_Applicant) === 1 ? 'Yes (√)' : 
                       (item.Is_Applicable || item.Is_Applicable_Applicant) === 2 ? 'No (X)' : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ border: '1px solid #000', borderTop: 'none', p: 1.5, fontSize: '11px' }}>
            I have checked and confirmed that the above safety requirements have been complied with and will be maintained. I will supervise the works and undertake to cease operation should there be any unsafe condition.
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Box><strong>Supervisor Name:</strong> <u>{ptw.Stage1_Person_Name || ptw.NameOfApplicant || '-'}</u></Box>
              <Box><strong>Sign Date/Time:</strong> <u>{ptw.Stage1_Date_Time ? new Date(ptw.Stage1_Date_Time).toLocaleString() : '-'}</u></Box>
            </Box>
          </Box>
        </Box>

        {/* STAGE 2: JOINT INSPECTION OR GAS TEST */}
        <Box sx={{ border: '1px solid #000', mb: 2.5 }}>
          <Box sx={{ bgcolor: '#eee', p: 0.8, borderBottom: '1px solid #000' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', fontSize: '12px' }}>
              {isConfined ? 'STAGE 2: EVALUATION BY CONFINED SPACE SAFETY ASSESSOR' : 'STAGE 2: JOINT SITE INSPECTION'}
            </Typography>
          </Box>
          <Box sx={{ p: 1.5, fontSize: '11px' }}>
            {isConfined ? (
              <>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={3}><strong>Oxygen Level:</strong> {ptw.Stage2_O2 || '-'}%</Grid>
                  <Grid item xs={3}><strong>CO Level:</strong> {ptw.Stage2_CO2 || '-'} ppm</Grid>
                  <Grid item xs={3}><strong>LEL level:</strong> {ptw.Stage2_LEL || '-'}%</Grid>
                  <Grid item xs={3}><strong>H2S level:</strong> {ptw.Stage2_H2S || '-'} ppm</Grid>
                  <Grid item xs={6}><strong>Safe for Entry:</strong> {ptw.Safe_for_Entry || '-'}</Grid>
                </Grid>
                <Typography variant="body2" sx={{ fontSize: '11px', mb: 1 }}><strong>Assessor Remarks:</strong> {ptw.Stage2_Comments || 'No comments.'}</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box><strong>Assessor Name:</strong> <u>{ptw.Stage2_Assessor_Name || '-'}</u> ({ptw.Stage2_Assessor_Desig || 'Assessor'})</Box>
                  <Box><strong>Date/Time:</strong> <u>{ptw.Stage2_Assessor_Date_Time ? new Date(ptw.Stage2_Assessor_Date_Time).toLocaleString() : '-'}</u></Box>
                </Box>
              </>
            ) : (
              <>
                I have inspected the above-stated location & confirmed that the recommended safety measures are in place and the said location is safe for work.
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Box><strong>Assessor Name/Signature:</strong> <u>{ptw.Stage2_Person_Name || '-'}</u></Box>
                  <Box><strong>Date/Time:</strong> <u>{ptw.Stage2_Date_Time ? new Date(ptw.Stage2_Date_Time).toLocaleString() : '-'}</u></Box>
                </Box>
              </>
            )}
          </Box>
        </Box>

        {/* STAGE 3: WSHO ASSESSMENT */}
        <Box sx={{ border: '1px solid #000', mb: 2.5 }}>
          <Box sx={{ bgcolor: '#eee', p: 0.8, borderBottom: '1px solid #000' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', fontSize: '12px' }}>
              {isConfined ? 'STAGE 3: ACKNOWLEDGEMENT BY WSHO / WSHC' : 'STAGE 3: ASSESSMENT BY SAFETY ASSESSOR'}
            </Typography>
          </Box>
          <Box sx={{ p: 1.5, fontSize: '11px' }}>
            {isConfined ? (
              <>
                I have evaluated the risk assessment and confined space entries and acknowledge the safety setups.
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Box><strong>WSHO Name:</strong> <u>{ptw.Stage3_WSH_Name || '-'}</u> ({ptw.Stage3_WSH_Desig || 'WSHO'})</Box>
                  <Box><strong>Date/Time:</strong> <u>{ptw.Stage3_WSH_Date_Time ? new Date(ptw.Stage3_WSH_Date_Time).toLocaleString() : '-'}</u></Box>
                </Box>
              </>
            ) : (
              <>
                A thorough inspection and proper assessment of the work area and its surrounding have been conducted.
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Box><strong>Safety Assessor:</strong> <u>{ptw.Stage3_Person_Name || '-'}</u></Box>
                  <Box><strong>Date/Time:</strong> <u>{ptw.Stage3_Date_Time ? new Date(ptw.Stage3_Date_Time).toLocaleString() : '-'}</u></Box>
                </Box>
              </>
            )}
          </Box>
        </Box>

        {/* STAGE 4: PM APPROVAL */}
        <Box sx={{ border: '1px solid #000', mb: 2.5 }}>
          <Box sx={{ bgcolor: '#eee', p: 0.8, borderBottom: '1px solid #000' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', fontSize: '12px' }}>
              STAGE 4: APPROVAL BY PROJECT MANAGER / AUTHORIZED MANAGER
            </Typography>
          </Box>
          <Box sx={{ p: 1.5, fontSize: '11px' }}>
            {isConfined ? (
              <>
                I am satisfied that the work area is safe and the confined space permit is approved.
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Box><strong>Project Manager:</strong> <u>{ptw.Stage4_Mng_Name || '-'}</u></Box>
                  <Box><strong>Date/Time:</strong> <u>{ptw.Stage4_Date_Time ? new Date(ptw.Stage4_Date_Time).toLocaleString() : '-'}</u></Box>
                </Box>
              </>
            ) : (
              <>
                Permit is approved. Daily safety checklists must be maintained continuously.
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Box><strong>Supervisor:</strong> <u>{ptw.Stage4_Sup_Name || '-'}</u> ({ptw.Stage4_Sup_Date_Time ? new Date(ptw.Stage4_Sup_Date_Time).toLocaleDateString() : '-'})</Box>
                  <Box><strong>WSH Manager/Assessor:</strong> <u>{ptw.Stage4_WSH_Name || '-'}</u> ({ptw.Stage4_WSH_Date_Time ? new Date(ptw.Stage4_WSH_Date_Time).toLocaleDateString() : '-'})</Box>
                </Box>
              </>
            )}
          </Box>
        </Box>

        {/* WORKERS INVOLVED list */}
        <Box sx={{ mb: 2.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, fontSize: '12px' }}>
            REGISTER OF WORKERS AUTHORIZED FOR THIS WORK
          </Typography>
          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 0, borderColor: '#000' }}>
            <Table size="small">
              <TableHead sx={{ bgcolor: '#eee' }}>
                <TableRow>
                  <TableCell sx={{ borderRight: '1px solid #000', borderBottom: '1px solid #000', color: '#000', fontWeight: 'bold', width: '10%' }}>S/N</TableCell>
                  <TableCell sx={{ borderRight: '1px solid #000', borderBottom: '1px solid #000', color: '#000', fontWeight: 'bold', width: '50%' }}>Worker Name</TableCell>
                  <TableCell sx={{ borderRight: '1px solid #000', borderBottom: '1px solid #000', color: '#000', fontWeight: 'bold', width: '20%' }}>ID/Permit Number</TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #000', color: '#000', fontWeight: 'bold', width: '20%', textAlign: 'center' }}>Worker Signature</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ptw.workers && ptw.workers.length > 0 ? (
                  ptw.workers.map((w, idx) => (
                    <TableRow key={w.PTWEmployeeID}>
                      <TableCell sx={{ borderRight: '1px solid #000', borderBottom: '1px solid #000', fontSize: '11px', py: 0.5 }}>{idx + 1}</TableCell>
                      <TableCell sx={{ borderRight: '1px solid #000', borderBottom: '1px solid #000', fontSize: '11px', py: 0.5 }}>
                        {w.FirstName} {w.LastName || ''}
                      </TableCell>
                      <TableCell sx={{ borderRight: '1px solid #000', borderBottom: '1px solid #000', fontSize: '11px', py: 0.5 }}>{w.ID_Number || 'N/A'}</TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #000', fontSize: '11px', textAlign: 'center', py: 0.5 }}></TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} sx={{ textAlign: 'center', py: 1, fontSize: '11px' }}>No workers registered.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>
    </Box>
  );
}
