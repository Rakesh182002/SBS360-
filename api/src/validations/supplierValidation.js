import { body } from 'express-validator';

export const createSupplierValidation = [
  body('Company_Name')
    .trim()
    .notEmpty().withMessage('Company Name is required.')
    .isLength({ max: 150 }).withMessage('Company Name cannot exceed 150 characters.'),
  body('address.Email')
    .optional({ checkFalsy: true })
    .isEmail().withMessage('Please provide a valid email address for the supplier address.'),
  body('Spoc_Name')
    .optional({ checkFalsy: true })
    .isLength({ max: 100 }).withMessage('SPOC Name cannot exceed 100 characters.'),
  body('Supplier_Description')
    .optional({ checkFalsy: true })
    .isLength({ max: 100 }).withMessage('Supplier Description cannot exceed 100 characters.')
];

export const updateSupplierValidation = [
  body('Company_Name')
    .trim()
    .notEmpty().withMessage('Company Name is required.')
    .isLength({ max: 150 }).withMessage('Company Name cannot exceed 150 characters.'),
  body('address.Email')
    .optional({ checkFalsy: true })
    .isEmail().withMessage('Please provide a valid email address for the supplier address.'),
  body('Spoc_Name')
    .optional({ checkFalsy: true })
    .isLength({ max: 100 }).withMessage('SPOC Name cannot exceed 100 characters.'),
  body('Supplier_Description')
    .optional({ checkFalsy: true })
    .isLength({ max: 100 }).withMessage('Supplier Description cannot exceed 100 characters.')
];
