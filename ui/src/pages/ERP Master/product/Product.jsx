import React, { useState } from 'react';
import { Chip, Box } from '@mui/material';
import { ResponsiveTable } from '../../../components/ReusableComponents';

const columns = [
  { id: 'id', label: 'Product ID', align: 'left' },
  { id: 'name', label: 'Product Name', align: 'left' },
  { id: 'sku', label: 'SKU', align: 'left' },
  { id: 'category', label: 'Category', align: 'left' },
  { id: 'price', label: 'Unit Price', align: 'left' },
  { id: 'stock', label: 'Stock Qty', align: 'left' },
  {
    id: 'status',
    label: 'Status',
    align: 'left',
    render: (val) => (
      <Chip
        label={val}
        size="small"
        color={val === 'Active' ? 'success' : 'default'}
        variant="filled"
        sx={{ fontWeight: 600, borderRadius: 1.5 }}
      />
    )
  }
];

const initialProducts = [
  { id: 'PRD-001', name: 'Industrial Valve A1', sku: 'VAL-A1-001', category: 'Hardware', price: '$45.00', stock: '150', status: 'Active' },
  { id: 'PRD-002', name: 'Hydraulic Pump HP2', sku: 'PMP-HP2-002', category: 'Machinery', price: '$350.00', stock: '45', status: 'Active' },
  { id: 'PRD-003', name: 'Heavy Duty Hose H8', sku: 'HSE-H8-003', category: 'Fittings', price: '$12.50', stock: '500', status: 'Active' }
];

export default function Product() {
  const [products, setProducts] = useState(initialProducts);

  const handleSave = (newProduct, allProducts) => {
    setProducts(allProducts);
  };

  const handleDelete = (id, allProducts) => {
    setProducts(allProducts);
  };

  return (
    <Box>
      <ResponsiveTable
        title="Product Inventory"
        description="Manage company inventory, stock items, SKUs, and pricing details."
        columns={columns}
        initialRows={products}
        idPrefix="PRD"
        onSave={handleSave}
        onDelete={handleDelete}
        breadcrumbs={[{ label: 'Home', href: '/Dashboard' }, { label: 'Products' }]}
      />
    </Box>
  );
}
