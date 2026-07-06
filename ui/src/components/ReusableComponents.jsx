import React, { useState, useEffect } from 'react';
import { 
  CircularProgress, Backdrop, Snackbar, Alert as MuiAlert, 
  Dialog, DialogTitle, DialogContent, DialogActions, Button as MuiButton,
  TextField, FormControl, InputLabel, Select, MenuItem,
  Card as MuiCard, CardContent, Typography, Box,
  Breadcrumbs, Link, TableContainer, Table as MuiTable, TableHead, 
  TableRow, TableCell, TableBody, TablePagination, Paper,
  Accordion as MuiAccordion, AccordionSummary, AccordionDetails,
  Grid, IconButton, InputAdornment, TableSortLabel, alpha, Tooltip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import TableChartIcon from '@mui/icons-material/TableChart';
import DescriptionIcon from '@mui/icons-material/Description';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

// 1. Loading Overlay Spinner
export const Loader = ({ open }) => (
  <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1000 }} open={open}>
    <CircularProgress color="inherit" />
  </Backdrop>
);

// 2. Toast Notifications
export const ToastNotification = ({ open, message, severity = 'info', onClose }) => (
  <Snackbar 
    open={open} 
    autoHideDuration={4000} 
    onClose={onClose}
    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
  >
    <MuiAlert onClose={onClose} severity={severity} variant="filled" sx={{ width: '100%' }}>
      {message}
    </MuiAlert>
  </Snackbar>
);

// 3. Modals (Dialog Wrapper)
export const Modal = ({ open, title, children, actions, onClose, maxWidth = 'sm' }) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth={maxWidth} PaperProps={{ sx: { borderRadius: 3 } }}>
    <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>{title}</DialogTitle>
    <DialogContent dividers>{children}</DialogContent>
    <DialogActions sx={{ px: 3, py: 2 }}>{actions}</DialogActions>
  </Dialog>
);

// 4. Form Text Input Wrapper
export const FormInput = ({ label, name, value, onChange, type = 'text', required = false, error = false, helperText = '', multiline = false, rows = 1, ...props }) => (
  <TextField
    fullWidth
    variant="outlined"
    label={label}
    name={name}
    value={value}
    onChange={onChange}
    type={type}
    required={required}
    error={error}
    helperText={helperText}
    multiline={multiline}
    rows={rows}
    margin="normal"
    InputLabelProps={type === 'date' ? { shrink: true } : undefined}
    {...props}
  />
);

// 5. Form Select Dropdown Wrapper
export const FormSelect = ({ label, name, value, onChange, options = [], required = false, error = false, helperText = '' }) => (
  <FormControl fullWidth margin="normal" error={error} required={required}>
    <InputLabel>{label}</InputLabel>
    <Select value={value} label={label} name={name} onChange={onChange}>
      {options.map((opt) => (
        <MenuItem key={opt.value} value={opt.value}>
          {opt.label}
        </MenuItem>
      ))}
    </Select>
    {helperText && <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>{helperText}</Typography>}
  </FormControl>
);

// 5b. Reusable MUI Date Picker Component
export const FormDatePicker = ({ 
  label, 
  value, 
  onChange, 
  error = false, 
  helperText = '', 
  maxDate, 
  minDate,
  required = false,
  margin = 'normal',
  size,
  ...props 
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={label}
        value={value ? dayjs(value) : null}
        onChange={(newValue) => {
          onChange(newValue ? newValue.format('YYYY-MM-DD') : '');
        }}
        format="DD/MM/YYYY"
        maxDate={maxDate ? dayjs(maxDate) : undefined}
        minDate={minDate ? dayjs(minDate) : undefined}
        slotProps={{
          textField: {
            fullWidth: true,
            required: required,
            error: error,
            helperText: helperText,
            margin: margin,
            size: size
          }
        }}
        {...props}
      />
    </LocalizationProvider>
  );
};

// 5c. Reusable MUI Time Picker Component
export const FormTimePicker = ({ 
  label, 
  value, 
  onChange, 
  error = false, 
  helperText = '', 
  required = false,
  margin = 'normal',
  size,
  ...props 
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimePicker
        label={label}
        value={value ? dayjs(`2000-01-01T${value}`) : null}
        onChange={(newValue) => {
          onChange(newValue ? newValue.format('HH:mm') : '');
        }}
        slotProps={{
          textField: {
            fullWidth: true,
            required: required,
            error: error,
            helperText: helperText,
            margin: margin,
            size: size
          }
        }}
        {...props}
      />
    </LocalizationProvider>
  );
};

// 5d. Reusable MUI DateTime Picker Component
export const FormDateTimePicker = ({ 
  label, 
  value, 
  onChange, 
  error = false, 
  helperText = '', 
  required = false,
  margin = 'normal',
  size,
  ...props 
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        label={label}
        value={value ? dayjs(value) : null}
        onChange={(newValue) => {
          onChange(newValue ? newValue.format('YYYY-MM-DDTHH:mm') : '');
        }}
        format="DD/MM/YYYY hh:mm A"
        slotProps={{
          textField: {
            fullWidth: true,
            required: required,
            error: error,
            helperText: helperText,
            margin: margin,
            size: size
          }
        }}
        {...props}
      />
    </LocalizationProvider>
  );
};

// 6. Statistics / KPI Card
export const StatCard = ({ title, value, icon, color = 'primary.main', trend = '' }) => {
  const isHexColor = color.startsWith('#');
  const resolvedColor = isHexColor ? color : 'primary.main';

  return (
    <MuiCard sx={{ 
      height: '100%', 
      position: 'relative', 
      overflow: 'hidden',
      borderRadius: 4,
      boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.02)',
      border: '1px solid',
      borderColor: 'divider',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': { 
        transform: 'translateY(-4px)',
        boxShadow: `0 12px 30px -10px ${isHexColor ? resolvedColor + '30' : 'rgba(99, 102, 241, 0.2)'}`,
        borderColor: isHexColor ? `${resolvedColor}50` : 'primary.light'
      }
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            {title}
          </Typography>
          <Box sx={{ 
            p: 1.25, 
            borderRadius: '12px', 
            bgcolor: isHexColor ? `${resolvedColor}15` : 'primary.light', 
            color: isHexColor ? resolvedColor : '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isHexColor ? `0 4px 10px 0 ${resolvedColor}10` : 'none'
          }}>
            {icon}
          </Box>
        </Box>
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-1px' }}>
          {value}
        </Typography>
        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Typography variant="caption" sx={{ 
              color: trend.startsWith('+') ? 'success.main' : trend.startsWith('-') ? 'error.main' : 'text.secondary', 
              fontWeight: 700,
              bgcolor: trend.startsWith('+') ? 'rgba(16, 185, 129, 0.1)' : trend.startsWith('-') ? 'rgba(239, 68, 68, 0.1)' : 'action.hover',
              px: 1.25,
              py: 0.25,
              borderRadius: 1.5
            }}>
              {trend}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
              vs last month
            </Typography>
          </Box>
        )}
      </CardContent>
    </MuiCard>
  );
};

// 7. Breadcrumbs Navigation
export const Breadcrumb = ({ items = [] }) => (
  <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 2 }}>
    {items.map((item, idx) => {
      const isLast = idx === items.length - 1;
      return isLast ? (
        <Typography key={idx} color="text.primary" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
          {item.label}
        </Typography>
      ) : (
        <Link key={idx} underline="hover" color="inherit" href={item.href || '#'} sx={{ fontSize: '0.875rem' }}>
          {item.label}
        </Link>
      );
    })}
  </Breadcrumbs>
);

// 8. Dynamic Data Table with Pagination
export const DataTable = ({ columns = [], rows = [], page = 0, rowsPerPage = 5, totalCount, onPageChange, onRowsPerPageChange, actions }) => (
  <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 3 }}>
    <TableContainer sx={{ maxHeight: 440 }}>
      <MuiTable stickyHeader>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col.id} align={col.align || 'left'} sx={{ fontWeight: 700, bgcolor: 'background.paper' }}>
                {col.label}
              </TableCell>
            ))}
            {actions && <TableCell align="right" sx={{ fontWeight: 700, bgcolor: 'background.paper' }}>Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, idx) => (
            <TableRow hover role="checkbox" tabIndex={-1} key={row.id || idx}>
              {columns.map((col) => {
                const val = row[col.id];
                return (
                  <TableCell key={col.id} align={col.align || 'left'}>
                    {col.render ? col.render(val, row) : String(val)}
                  </TableCell>
                );
              })}
              {actions && <TableCell align="right">{actions(row)}</TableCell>}
            </TableRow>
          ))}
          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={columns.length + (actions ? 1 : 0)} align="center" sx={{ py: 3 }}>
                No records found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </MuiTable>
    </TableContainer>
    <TablePagination
      rowsPerPageOptions={[5, 10, 25]}
      component="div"
      count={totalCount || rows.length}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
    />
  </Paper>
);

// 9. Modern Accordion Wrapper
export const Accordion = ({ title, children }) => (
  <MuiAccordion sx={{ mb: 1, '&:before': { display: 'none' } }}>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography sx={{ fontWeight: 600 }}>{title}</Typography>
    </AccordionSummary>
    <AccordionDetails sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
      {children}
    </AccordionDetails>
  </MuiAccordion>
);

// 10. File Upload Button
export const FileUpload = ({ label = 'Upload File', onFileSelect }) => {
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', border: '2px dashed #cbd5e1', borderRadius: 3, p: 3, textAlign: 'center', bgcolor: 'background.default' }}>
      <CloudUploadIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Select or drag a file to upload
      </Typography>
      <MuiButton variant="contained" component="label" startIcon={<CloudUploadIcon />}>
        {label}
        <input type="file" hidden onChange={handleFileChange} />
      </MuiButton>
    </Box>
  );
};

// 11. Reusable Fully Responsive Table with Search, Pagination, Edit, Delete, and Actions
export const ResponsiveTable = ({
  title,
  description,
  columns = [],
  initialRows = [],
  idPrefix = 'REC',
  onSave,
  onEdit,
  onDelete,
  actions,
  breadcrumbs = []
}) => {
  const [rows, setRows] = useState(initialRows);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  // Add modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newRecord, setNewRecord] = useState({});

  // Sync state if initialRows changes
  useEffect(() => {
    setRows(initialRows);
  }, [initialRows]);

  // Search Filter Handler
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setPage(0);

    if (!query.trim()) {
      setRows(initialRows);
      return;
    }

    const filtered = initialRows.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(query.toLowerCase())
      )
    );
    setRows(filtered);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenAddModal = () => {
    const emptyRecord = { id: `${idPrefix}-${Date.now().toString().slice(-6)}` };
    columns.forEach((col) => {
      if (col.id !== 'id' && col.id !== 'actions') {
        emptyRecord[col.id] = col.id === 'status' ? 'Active' : '';
      }
    });
    setNewRecord(emptyRecord);
    setAddModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecord((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveRecord = (e) => {
    e.preventDefault();
    const updatedRows = [newRecord, ...rows];
    setRows(updatedRows);
    setAddModalOpen(false);

    if (onSave) {
      onSave(newRecord, updatedRows);
    } else {
      setToast({
        open: true,
        message: `Record ${newRecord.id} successfully created.`,
        severity: 'success'
      });
    }
  };

  const handleDeleteRecord = (recordId) => {
    const updatedRows = rows.filter((r) => r.id !== recordId);
    setRows(updatedRows);

    if (onDelete) {
      onDelete(recordId, updatedRows);
    } else {
      setToast({
        open: true,
        message: `Record ${recordId} successfully removed.`,
        severity: 'warning'
      });
    }
  };

  const renderDefaultActions = (row) => {
    if (actions) return actions(row);

    return (
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <IconButton
          size="small"
          color="primary"
          onClick={() => {
            if (onEdit) {
              onEdit(row);
            } else {
              setToast({
                open: true,
                message: `Editing record ${row.id} (Simulation)`,
                severity: 'info'
              });
            }
          }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          color="error"
          onClick={() => handleDeleteRecord(row.id)}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
    );
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header toolbar */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' },
        gap: 2,
        mb: 4
      }}>
        <Box>
          {breadcrumbs.length > 0 && <Breadcrumb items={breadcrumbs} />}
          <Typography variant="h4" sx={{ fontWeight: 800 }}>{title}</Typography>
          {description && (
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          )}
        </Box>
        <MuiButton
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAddModal}
          sx={{ borderRadius: 2.5, px: 3, alignSelf: { xs: 'flex-start', sm: 'auto' } }}
        >
          Add Record
        </MuiButton>
      </Box>

      {/* Directory Toolbar Card */}
      <MuiCard sx={{ mb: 3, borderRadius: 3, boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.01)', border: '1px solid', borderColor: 'divider' }}>
        <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
          <Grid container spacing={2} alignItems="center" justifyContent="space-between">
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                placeholder={`Search records...`}
                value={searchQuery}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 2 }
                }}
              />
            </Grid>
            <Grid item>
              <MuiButton 
                variant="outlined" 
                startIcon={<FilterListIcon />}
                size="small"
                sx={{ borderRadius: 2 }}
                onClick={() => setToast({ open: true, message: 'Filters feature is simulated.', severity: 'info' })}
              >
                Filters
              </MuiButton>
            </Grid>
          </Grid>
        </CardContent>
      </MuiCard>

      {/* Responsive DataTable */}
      <DataTable
        columns={columns}
        rows={rows}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        actions={renderDefaultActions}
      />

      {/* Add Record Modal Form */}
      <Modal
        open={addModalOpen}
        title={`Register New Record`}
        onClose={() => setAddModalOpen(false)}
        actions={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <MuiButton onClick={() => setAddModalOpen(false)} variant="outlined" sx={{ borderRadius: 2 }}>
              Cancel
            </MuiButton>
            <MuiButton onClick={handleSaveRecord} variant="contained" sx={{ borderRadius: 2 }}>
              Save Record
            </MuiButton>
          </Box>
        }
      >
        <form onSubmit={handleSaveRecord}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <FormInput 
                label="Generated Record ID"
                value={newRecord.id || ''}
                disabled
              />
            </Grid>
            {columns.map((col) => {
              if (col.id === 'id' || col.id === 'actions') return null;
              return (
                <Grid item xs={12} key={col.id}>
                  <FormInput 
                    label={col.label}
                    name={col.id}
                    value={newRecord[col.id] || ''}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
              );
            })}
          </Grid>
        </form>
      </Modal>

      {/* Toast Alert */}
      <ToastNotification 
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </Box>
  );
};

// 12. Reusable Advanced Table with Sorting, Custom Actions, Search, and Exports
export const AdvancedTable = ({
  title = '',
  columns = [],
  rows = [],
  showActions = true,
  actions = null,
  showSearch = true,
  sortable = true,
  showCopy = false,
  showExcel = false,
  showCSV = false,
  showPDF = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState('');
  const [order, setOrder] = useState('asc');
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setPage(0);
  };

  const filteredRows = React.useMemo(() => {
    if (!searchQuery.trim()) return rows;
    const query = searchQuery.toLowerCase().trim();
    return rows.filter(row => 
      columns.some(col => {
        const val = row[col.id];
        return val !== null && val !== undefined && String(val).toLowerCase().includes(query);
      })
    );
  }, [rows, searchQuery, columns]);

  const handleSortRequest = (columnId) => {
    const isAsc = orderBy === columnId && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(columnId);
  };

  const sortedRows = React.useMemo(() => {
    if (!orderBy || !sortable) return filteredRows;
    return [...filteredRows].sort((a, b) => {
      const aVal = a[orderBy];
      const bVal = b[orderBy];
      
      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;
      
      const comp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true, sensitivity: 'base' });
      return order === 'asc' ? comp : -comp;
    });
  }, [filteredRows, orderBy, order, sortable]);

  const paginatedRows = React.useMemo(() => {
    return sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [sortedRows, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCopy = () => {
    const headers = columns.map(c => c.label).join('\t');
    const body = filteredRows.map(row => 
      columns.map(col => {
        const val = row[col.id];
        return val !== null && val !== undefined ? String(val) : '';
      }).join('\t')
    ).join('\n');
    const text = `${headers}\n${body}`;
    navigator.clipboard.writeText(text);
    setToastMessage('Table data copied to clipboard!');
    setToastOpen(true);
  };

  const handleExportCSV = () => {
    const headers = columns.map(c => `"${c.label.replace(/"/g, '""')}"`).join(',');
    const body = filteredRows.map(row => 
      columns.map(col => {
        const val = row[col.id];
        const valStr = val !== null && val !== undefined ? String(val) : '';
        return `"${valStr.replace(/"/g, '""')}"`;
      }).join(',')
    ).join('\n');
    const csvContent = '\uFEFF' + `${headers}\n${body}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${title || 'export'}_data.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportExcel = () => {
    let html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">`;
    html += `<head><meta charset="UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Sheet1</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body>`;
    html += `<table border="1"><thead><tr>`;
    columns.forEach(col => {
      html += `<th style="background-color: #f2f2f2; font-weight: bold;">${col.label}</th>`;
    });
    html += `</tr></thead><tbody>`;
    filteredRows.forEach(row => {
      html += `<tr>`;
      columns.forEach(col => {
        const val = row[col.id];
        html += `<td>${val !== null && val !== undefined ? String(val) : ''}</td>`;
      });
      html += `</tr>`;
    });
    html += `</tbody></table></body></html>`;
    const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${title || 'export'}_data.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    const printWindow = window.open('', '_blank');
    let html = `<html><head><title>${title || 'Table Print'}</title>`;
    html += `<style>
      body { font-family: sans-serif; padding: 20px; }
      table { width: 100%; border-collapse: collapse; margin-top: 20px; }
      th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
      th { background-color: #f2f2f2; font-weight: bold; }
      h2 { margin-bottom: 5px; }
      p { color: #666; font-size: 14px; margin-top: 0; }
    </style></head><body>`;
    html += `<h2>${title || 'Table Data'}</h2>`;
    html += `<p>Generated on: ${new Date().toLocaleString()}</p>`;
    html += `<table><thead><tr>`;
    columns.forEach(col => {
      html += `<th>${col.label}</th>`;
    });
    html += `</tr></thead><tbody>`;
    filteredRows.forEach(row => {
      html += `<tr>`;
      columns.forEach(col => {
        const val = row[col.id];
        html += `<td>${val !== null && val !== undefined ? String(val) : ''}</td>`;
      });
      html += `</tr>`;
    });
    html += `</tbody></table>`;
    html += `<script>window.onload = function() { window.print(); window.close(); }</script>`;
    html += `</body></html>`;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Table Toolbar / Control Card */}
      <Paper 
        sx={{ 
          mb: 2, 
          p: 2, 
          borderRadius: 1, 
          border: '1px solid', 
          borderColor: 'divider', 
          boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.02)',
          bgcolor: 'background.paper'
        }}
      >
        <Grid container spacing={2} alignItems="center" justifyContent="space-between">
          {/* Left Side: Export buttons */}
          <Grid item xs={12} sm={6} md={8}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
              {showCopy && (
                <MuiButton 
                  size="small" 
                  variant="outlined" 
                  startIcon={<ContentCopyIcon fontSize="small" />}
                  onClick={handleCopy}
                  sx={{ 
                    borderRadius: 1, 
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 2.5,
                    py: 0.75,
                    color: '#4f46e5',
                    borderColor: '#4f46e530',
                    bgcolor: '#4f46e50a',
                    '&:hover': {
                      bgcolor: '#4f46e515',
                      borderColor: '#4f46e560',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 10px rgba(79, 70, 229, 0.15)'
                    },
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  Copy
                </MuiButton>
              )}
              {showExcel && (
                <MuiButton 
                  size="small" 
                  variant="outlined" 
                  startIcon={<TableChartIcon fontSize="small" />}
                  onClick={handleExportExcel}
                  sx={{ 
                    borderRadius: 1, 
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 2.5,
                    py: 0.75,
                    color: '#10b981',
                    borderColor: '#10b98130',
                    bgcolor: '#10b9810a',
                    '&:hover': {
                      bgcolor: '#10b98115',
                      borderColor: '#10b98160',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 10px rgba(16, 185, 129, 0.15)'
                    },
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  Excel
                </MuiButton>
              )}
              {showCSV && (
                <MuiButton 
                  size="small" 
                  variant="outlined" 
                  startIcon={<DescriptionIcon fontSize="small" />}
                  onClick={handleExportCSV}
                  sx={{ 
                    borderRadius: 1, 
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 2.5,
                    py: 0.75,
                    color: '#0d9488',
                    borderColor: '#0d948830',
                    bgcolor: '#0d94880a',
                    '&:hover': {
                      bgcolor: '#0d948815',
                      borderColor: '#0d948860',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 10px rgba(13, 148, 136, 0.15)'
                    },
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  CSV
                </MuiButton>
              )}
              {showPDF && (
                <MuiButton 
                  size="small" 
                  variant="outlined" 
                  startIcon={<PictureAsPdfIcon fontSize="small" />}
                  onClick={handleExportPDF}
                  sx={{ 
                    borderRadius:  1, 
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 2.5,
                    py: 0.75,
                    color: '#e11d48',
                    borderColor: '#e11d4830',
                    bgcolor: '#e11d480a',
                    '&:hover': {
                      bgcolor: '#e11d4815',
                      borderColor: '#e11d4860',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 10px rgba(225, 29, 72, 0.15)'
                    },
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  PDF
                </MuiButton>
              )}
            </Box>
          </Grid>

          {/* Right Side: Search */}
          {showSearch && (
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                placeholder="Search table..."
                value={searchQuery}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" color="primary" />
                    </InputAdornment>
                  ),
                  sx: { 
                    borderRadius: 1,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'divider',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.light',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                      borderWidth: '2px',
                    },
                    bgcolor: 'action.hover',
                    transition: 'all 0.2s ease-in-out'
                  }
                }}
              />
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Main Table */}
      <Paper 
        sx={{ 
          width: '100%', 
          overflow: 'hidden', 
          borderRadius: 1, 
          border: '1px solid', 
          borderColor: 'divider', 
          boxShadow: '0 10px 30px 0 rgba(0, 0, 0, 0.03)' 
        }}
      >
        <TableContainer sx={{ maxHeight: 600 }}>
          <MuiTable stickyHeader size="medium">
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell 
                    key={col.id} 
                    align={col.align || 'left'} 
                    sx={{ 
                      fontWeight: 700, 
                      color: (theme) => theme.palette.mode === 'light' ? theme.palette.primary.dark : theme.palette.primary.light,
                      background: (theme) => theme.palette.mode === 'light' ? '#eef2ff' : '#1e293b',
                      py: 1.75,
                      px: 2.5,
                      borderBottom: (theme) => `2px solid ${theme.palette.mode === 'light' ? '#c7d2fe' : '#334155'}`,
                      '&.MuiTableCell-root': {
                        color: (theme) => theme.palette.mode === 'light' ? theme.palette.primary.dark : theme.palette.primary.light,
                      },
                      '& .MuiTableSortLabel-root': {
                        color: (theme) => theme.palette.mode === 'light' ? theme.palette.primary.dark : theme.palette.primary.light,
                        '&:hover': {
                          color: (theme) => theme.palette.primary.main,
                        },
                        '&.Mui-active': {
                          color: (theme) => theme.palette.primary.main,
                          '& .MuiTableSortLabel-icon': {
                            color: (theme) => theme.palette.primary.main + ' !important',
                          },
                        },
                      },
                      '& .MuiTableSortLabel-icon': {
                        color: (theme) => (theme.palette.mode === 'light' ? theme.palette.primary.main : theme.palette.primary.light) + ' !important',
                      }
                    }}
                    sortDirection={orderBy === col.id ? order : false}
                  >
                    {sortable && col.sortable !== false ? (
                      <TableSortLabel
                        active={orderBy === col.id}
                        direction={orderBy === col.id ? order : 'asc'}
                        onClick={() => handleSortRequest(col.id)}
                      >
                        {col.label}
                      </TableSortLabel>
                    ) : (
                      col.label
                    )}
                  </TableCell>
                ))}
                {showActions && actions && (
                  <TableCell 
                    align="right" 
                    sx={{ 
                      fontWeight: 700, 
                      color: (theme) => theme.palette.mode === 'light' ? theme.palette.primary.dark : theme.palette.primary.light,
                      background: (theme) => theme.palette.mode === 'light' ? '#eef2ff' : '#1e293b',
                      py: 1.75,
                      px: 2.5,
                      borderBottom: (theme) => `2px solid ${theme.palette.mode === 'light' ? '#c7d2fe' : '#334155'}`,
                      '&.MuiTableCell-root': {
                        color: (theme) => theme.palette.mode === 'light' ? theme.palette.primary.dark : theme.palette.primary.light,
                      }
                    }}
                  >
                    Actions
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.map((row, idx) => (
                <TableRow 
                  hover 
                  key={row.id || row.ClientID || idx}
                  sx={{
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:nth-of-type(even)': {
                      bgcolor: 'action.hover'
                    },
                    '&:hover': {
                      bgcolor: (theme) => `${alpha(theme.palette.primary.main, 0.06)} !important`,
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                    }
                  }}
                >
                  {columns.map((col) => {
                    const val = row[col.id];
                    const valStr = val !== null && val !== undefined ? String(val) : '-';
                    const isLongText = !col.render && typeof val === 'string' && val.length > 25;
                    const displayedContent = col.render ? col.render(val, row) : valStr;

                    return (
                      <TableCell 
                        key={col.id} 
                        align={col.align || 'left'} 
                        sx={{ 
                          py: 1.75, 
                          px: 2.5, 
                          color: 'text.primary', 
                          fontWeight: 500,
                          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                          maxWidth: col.maxWidth || 220
                        }}
                      >
                        {isLongText ? (
                          <Tooltip title={valStr} arrow enterDelay={300} leaveDelay={100}>
                            <Box sx={{ 
                              overflow: 'hidden', 
                              textOverflow: 'ellipsis', 
                              whiteSpace: 'nowrap' 
                            }}>
                              {valStr}
                            </Box>
                          </Tooltip>
                        ) : (
                          displayedContent
                        )}
                      </TableCell>
                    );
                  })}
                  {showActions && actions && (
                    <TableCell 
                      align="right" 
                      sx={{ 
                        py: 1.75, 
                        px: 2.5,
                        borderBottom: (theme) => `1px solid ${theme.palette.divider}`
                      }}
                    >
                      {actions(row)}
                    </TableCell>
                  )}
                </TableRow>
              ))}
              {filteredRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={columns.length + (showActions && actions ? 1 : 0)} align="center" sx={{ py: 8 }}>
                    <Typography color="text.secondary" variant="body1" sx={{ fontWeight: 500 }}>
                      No records found matching your search.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </MuiTable>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Internal Copy Toast */}
      <Snackbar 
        open={toastOpen} 
        autoHideDuration={3000} 
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MuiAlert onClose={() => setToastOpen(false)} severity="success" variant="filled">
          {toastMessage}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};
