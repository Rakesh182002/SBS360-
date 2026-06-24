import express from 'express';
import * as supplierController from '../../../Controllers/supplierController.js';
import authMiddleware from '../../../middleware/authMiddleware.js';
import validate from '../../../middleware/validateMiddleware.js';
import { 
  createSupplierValidation, 
  updateSupplierValidation 
} from '../../../validations/supplierValidation.js';

const router = express.Router();

// Protect all supplier routes under auth check
router.use(authMiddleware);

router.get('/', supplierController.getSuppliers);
router.get('/industries', supplierController.getIndustries);
router.get('/:id', supplierController.getSupplierDetails);

router.post('/', createSupplierValidation, validate, supplierController.createSupplier);
router.put('/:id', updateSupplierValidation, validate, supplierController.updateSupplier);
router.delete('/:id', supplierController.deleteSupplier);

export default router;
