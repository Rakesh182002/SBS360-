import express from 'express';
import * as employeeController from '../../../Controllers/employeeController.js';
import authMiddleware from '../../../middleware/authMiddleware.js';
import validate from '../../../middleware/validateMiddleware.js';
import { 
  createEmployeeValidation, 
  updateEmployeeValidation 
} from '../../../validations/employeeValidation.js';

const router = express.Router();

// Apply auth check to all employee endpoints
router.use(authMiddleware);

router.get('/', employeeController.getEmployees);
router.get('/groups', employeeController.getUserGroups);
router.get('/addresses', employeeController.getAddresses);
router.get('/names', employeeController.getAllEmployeeNames);
router.get('/:id', employeeController.getEmployeeDetails);

router.post('/filter', employeeController.getFilterEmployees);
router.post('/', createEmployeeValidation, validate, employeeController.createEmployee);
router.put('/:id', updateEmployeeValidation, validate, employeeController.updateEmployee);
router.delete('/:id', employeeController.deleteEmployee);

export default router;
