import React, { useState } from 'react';
import { Chip, Box } from '@mui/material';
import { ResponsiveTable } from '../../../components/ReusableComponents';

const columns = [
  { id: 'id', label: 'Vehicle ID', align: 'left' },
  { id: 'model', label: 'Vehicle Model', align: 'left' },
  { id: 'licensePlate', label: 'License Plate', align: 'left' },
  { id: 'type', label: 'Type', align: 'left' },
  { id: 'driver', label: 'Assigned Driver', align: 'left' },
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

const initialVehicles = [
  { id: 'VEH-001', model: 'Ford Transit Cargo Van', licensePlate: 'TX-892-BB', type: 'Cargo Van', driver: 'Mark Miller', status: 'Active' },
  { id: 'VEH-002', model: 'Freightliner M2 Truck', licensePlate: 'CA-102-LL', type: 'Box Truck', driver: 'Frank Castle', status: 'Active' },
  { id: 'VEH-003', model: 'Toyota Hilux Pickup', licensePlate: 'NY-471-ZZ', type: 'Pickup Truck', driver: 'Rick Grimes', status: 'Inactive' }
];

export default function Vehicle() {
  const [vehicles, setVehicles] = useState(initialVehicles);

  const handleSave = (newVehicle, allVehicles) => {
    setVehicles(allVehicles);
  };

  const handleDelete = (id, allVehicles) => {
    setVehicles(allVehicles);
  };

  return (
    <Box>
      <ResponsiveTable
        title="Fleet Vehicles"
        description="Monitor cargo vans, freight trucks, license registrations, and operator assignments."
        columns={columns}
        initialRows={vehicles}
        idPrefix="VEH"
        onSave={handleSave}
        onDelete={handleDelete}
        breadcrumbs={[{ label: 'Home', href: '/Dashboard' }, { label: 'Vehicles' }]}
      />
    </Box>
  );
}
