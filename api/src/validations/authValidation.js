import { body } from 'express-validator';

export const loginValidation = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required.'),
  body('password')
    .notEmpty().withMessage('Password is required.')
];

export const changePasswordValidation = [
  body('oldPassword')
    .notEmpty().withMessage('Old password is required.'),
  body('newPassword')
    .notEmpty().withMessage('New password is required.')
    .isLength({ min: 6 }).withMessage('New password must be at least 6 characters long.')
];

export const resetPasswordValidation = [
  body('token')
    .notEmpty().withMessage('Password reset token is required.'),
  body('newPassword')
    .notEmpty().withMessage('New password is required.')
    .isLength({ min: 6 }).withMessage('New password must be at least 6 characters long.')
];

export const forgotPasswordValidation = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required.')
];
