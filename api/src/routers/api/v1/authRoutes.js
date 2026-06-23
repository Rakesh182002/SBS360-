import express from 'express';
import * as authController from '../../../Controllers/authController.js';
import authMiddleware from '../../../middleware/authMiddleware.js';
import validate from '../../../middleware/validateMiddleware.js';
import { 
  loginValidation, 
  changePasswordValidation, 
  resetPasswordValidation, 
  forgotPasswordValidation 
} from '../../../validations/authValidation.js';

const router = express.Router();

// Public endpoints
router.post('/login', loginValidation, validate, authController.login);
router.post('/refresh', authController.refresh);
router.post('/forgot-password', forgotPasswordValidation, validate, authController.forgotPassword);
router.post('/reset-password', resetPasswordValidation, validate, authController.resetPassword);

// Protected endpoints
router.post('/change-password', authMiddleware, changePasswordValidation, validate, authController.changePassword);
router.post('/logout', authMiddleware, authController.logout);

export default router;
