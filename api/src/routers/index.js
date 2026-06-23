import express from 'express';
import authRoutes from './api/v1/authRoutes.js';
import clientRoutes from './api/v1/clientRoutes.js';
import employeeRoutes from './api/v1/employeeRoutes.js';

const router = express.Router();

// Mount routes with v1 api versioning
router.use('/api/v1/auth', authRoutes);
router.use('/api/v1/clients', clientRoutes);
router.use('/api/v1/employees', employeeRoutes);

export default router;

