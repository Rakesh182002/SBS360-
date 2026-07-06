import express from 'express';
import * as safetyController from '../../../Controllers/safetyController.js';
import authMiddleware from '../../../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth check to all safety endpoints
router.use(authMiddleware);

// Dropdown Metadata Routes
router.get('/hazards', safetyController.getHazards);
router.get('/ppes', safetyController.getPpes);
router.get('/inspection-items', safetyController.getSafetyInspectionItems);
router.get('/projects', safetyController.getProjects);

// Safety Master Routes
router.get('/', safetyController.getSafetys);
router.get('/:id', safetyController.getSafetyDetails);
router.post('/', safetyController.createSafety);
router.put('/:id', safetyController.updateSafety);
router.delete('/:id', safetyController.deleteSafety);

// Safety Inspection checklist (SI) Routes
router.get('/inspections/all', safetyController.getSafetyInspections);
router.get('/inspections/:id', safetyController.getSafetyInspectionDetails);
router.post('/inspections', safetyController.createSafetyInspection);
router.put('/inspections/:id', safetyController.updateSafetyInspection);

// ESH Inspection (New SI) Routes
router.get('/esh/all', safetyController.getEhsInspections);
router.get('/esh/:id', safetyController.getEhsInspectionDetails);
router.post('/esh', safetyController.createEhsInspection);
router.put('/esh/:id', safetyController.updateEhsInspection);

// PTW Routes
router.get('/ptw/all', safetyController.getPtws);
router.get('/ptw/config/:type', safetyController.getPtwChecklistConfig);
router.get('/ptw/details/:id', safetyController.getPtwDetails);
router.post('/ptw', safetyController.createPtw);
router.put('/ptw/:id', safetyController.updatePtw);
router.delete('/ptw/:id', safetyController.deletePtw);

export default router;
