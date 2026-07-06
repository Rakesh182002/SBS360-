import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

import API from '../../../services/api';
import { Loader, ToastNotification, AdvancedTable } from '../../../components/ReusableComponents';

export default function StockList() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const columns = [
    { id: 'Product_Code', label: 'Product Code', sortable: true },
    { id: 'Product_Name', label: 'Product Name', sortable: true },
    { id: 'Store_Name', label: 'Store Name', sortable: true },
    { 
      id: 'Quantity', 
      label: 'Current Stock', 
      sortable: true,
      render: (val) => val !== null ? parseInt(val, 10).toLocaleString() : '0'
    },
    { id: 'UoM', label: 'UoM', sortable: true }
  ];

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    setLoading(true);
    try {
      const response = await API.get('/material/stock');
      setStocks(response.data.data || []);
    } catch (error) {
      setToast({
        open: true,
        message: error.message || 'Failed to fetch current inventory stocks.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Loader open={loading} />

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 4
      }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>Stock Balance Ledger</Typography>
        </Box>
        <Box>
          <IconButton onClick={fetchStocks} size="medium" color="default" sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>

      <AdvancedTable
        title="Stock Inventory Details"
        columns={columns}
        rows={stocks}
        showSearch={true}
        sortable={true}
        showActions={false}
        showCopy={true}
        showExcel={true}
        showCSV={true}
        showPDF={true}
      />

      <ToastNotification 
        open={toast.open} 
        message={toast.message} 
        severity={toast.severity} 
        onClose={() => setToast({ ...toast, open: false })} 
      />
    </Box>
  );
}
