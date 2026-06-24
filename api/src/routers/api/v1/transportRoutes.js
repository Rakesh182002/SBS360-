import express from 'express';
import * as transportController from '../../../Controllers/transportController.js';
import authMiddleware from '../../../middleware/authMiddleware.js';
import validate from '../../../middleware/validateMiddleware.js';
import { 
  createTransportValidation, 
  updateTransportValidation 
} from '../../../validations/transportValidation.js';

const router = express.Router();

// Apply auth middleware to protect all transport endpoints
router.use(authMiddleware);

router.get('/', transportController.getTransports);
router.get('/:id', transportController.getTransportDetails);

router.post('/', createTransportValidation, validate, transportController.createTransport);
router.put('/:id', updateTransportValidation, validate, transportController.updateTransport);
router.delete('/:id', transportController.deleteTransport);

export default router;
