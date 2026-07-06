import express from 'express';
import authRoutes from './api/v1/authRoutes.js';
import clientRoutes from './api/v1/clientRoutes.js';
import employeeRoutes from './api/v1/employeeRoutes.js';
import supplierRoutes from './api/v1/supplierRoutes.js';
import transportRoutes from './api/v1/transportRoutes.js';
import productRoutes from './api/v1/productRoutes.js';
import materialRoutes from './api/v1/materialRoutes.js';
import safetyRoutes from './api/v1/safetyRoutes.js';

const router = express.Router();

// Mount routes with v1 api versioning
router.use('/api/v1/auth', authRoutes);
router.use('/api/v1/clients', clientRoutes);
router.use('/api/v1/employees', employeeRoutes);
router.use('/api/v1/suppliers', supplierRoutes);
router.use('/api/v1/transports', transportRoutes);
router.use('/api/v1/products', productRoutes);
router.use('/api/v1/material', materialRoutes);
router.use('/api/v1/safety', safetyRoutes);

export default router;

