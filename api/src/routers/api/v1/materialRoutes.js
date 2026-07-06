import express from 'express';
import * as materialController from '../../../Controllers/materialController.js';
import authMiddleware from '../../../middleware/authMiddleware.js';
import validate from '../../../middleware/validateMiddleware.js';
import {
  storeValidation,
  inwardValidation,
  outwardValidation,
  stockAdjustmentValidation
} from '../../../validations/materialValidation.js';

const router = express.Router();

// Apply authentication middleware to all material management endpoints
router.use(authMiddleware);

// Store routes
router.get('/stores', materialController.getStores);
router.get('/stores/:id', materialController.getStoreDetails);
router.post('/stores', storeValidation, validate, materialController.createStore);
router.put('/stores/:id', storeValidation, validate, materialController.updateStore);
router.delete('/stores/:id', materialController.deleteStore);

// Inward routes
router.get('/inwards', materialController.getInwards);
router.get('/inwards/:id', materialController.getInwardDetails);
router.post('/inwards', inwardValidation, validate, materialController.createInward);
router.put('/inwards/:id', inwardValidation, validate, materialController.updateInward);

// Outward routes
router.get('/outwards', materialController.getOutwards);
router.get('/outwards/:id', materialController.getOutwardDetails);
router.post('/outwards', outwardValidation, validate, materialController.createOutward);
router.put('/outwards/:id', outwardValidation, validate, materialController.updateOutward);

// Stock routes
router.get('/stock', materialController.getStockSummary);
router.get('/stock/current', materialController.getCurrentStock);

// Stock Adjustments / Stocktaking routes
router.get('/stocktaking', materialController.getStockAdjustments);
router.get('/stocktaking/:id', materialController.getStockAdjustmentDetails);
router.post('/stocktaking', stockAdjustmentValidation, validate, materialController.createStockAdjustment);

// Report routes
router.post('/reports/inward', materialController.getInwardReport);
router.post('/reports/outward', materialController.getOutwardReport);

export default router;
