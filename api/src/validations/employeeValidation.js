import { body } from 'express-validator';

export const createEmployeeValidation = [
  body('FirstName')
    .trim()
    .notEmpty().withMessage('First Name is required.')
    .isLength({ max: 50 }).withMessage('First Name cannot exceed 50 characters.'),
  
  body('LastName')
    .trim()
    .notEmpty().withMessage('Last Name is required.')
    .isLength({ max: 50 }).withMessage('Last Name cannot exceed 50 characters.'),
  
  body('GroupID')
    .notEmpty().withMessage('User Group is required.')
    .isInt().withMessage('GroupID must be an integer.'),

  body('address.Email')
    .optional({ checkFalsy: true })
    .isEmail().withMessage('Please provide a valid email address for the employee.'),

  body('UserName')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 3, max: 80 }).withMessage('Username must be between 3 and 80 characters.'),

  body('Password')
    .optional({ checkFalsy: true })
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
];

export const updateEmployeeValidation = [
  body('FirstName')
    .trim()
    .notEmpty().withMessage('First Name is required.')
    .isLength({ max: 50 }).withMessage('First Name cannot exceed 50 characters.'),
  
  body('LastName')
    .trim()
    .notEmpty().withMessage('Last Name is required.')
    .isLength({ max: 50 }).withMessage('Last Name cannot exceed 50 characters.'),
  
  body('GroupID')
    .notEmpty().withMessage('User Group is required.')
    .isInt().withMessage('GroupID must be an integer.'),

  body('address.Email')
    .optional({ checkFalsy: true })
    .isEmail().withMessage('Please provide a valid email address for the employee.'),

  body('UserName')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 3, max: 80 }).withMessage('Username must be between 3 and 80 characters.'),

  body('Password')
    .optional({ checkFalsy: true })
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
];
