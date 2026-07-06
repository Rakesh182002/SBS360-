import express from 'express';
import * as productController from '../../../Controllers/productController.js';
import authMiddleware from '../../../middleware/authMiddleware.js';
import validate from '../../../middleware/validateMiddleware.js';
import {
  createProductValidation,
  updateProductValidation
} from '../../../validations/productValidation.js';

const router = express.Router();

// Apply auth check to all product endpoints
router.use(authMiddleware);

router.get('/', productController.getProducts);
router.post('/filter', productController.getFilterProducts);
router.get('/:id', productController.getProductDetails);

router.post('/', createProductValidation, validate, productController.createProduct);
router.put('/:id', updateProductValidation, validate, productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

export default router;
