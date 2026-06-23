import express from 'express';
import * as clientController from '../../../Controllers/clientController.js';
import authMiddleware from '../../../middleware/authMiddleware.js';
import validate from '../../../middleware/validateMiddleware.js';
import { 
  createClientValidation, 
  updateClientValidation 
} from '../../../validations/clientValidation.js';

const router = express.Router();

// Apply auth check to all client endpoints
router.use(authMiddleware);

router.get('/', clientController.getClients);
router.get('/functions', clientController.getFunctions);
router.get('/industries', clientController.getIndustries);
router.get('/:id', clientController.getClientDetails);
router.get('/contacts/:id', clientController.getContact);

router.post('/', createClientValidation, validate, clientController.createClient);
router.put('/:id', updateClientValidation, validate, clientController.updateClient);
router.delete('/:id', clientController.deleteClient);

export default router;
