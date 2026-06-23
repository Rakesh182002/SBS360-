import { body } from 'express-validator';

export const createClientValidation = [
  body('Company_Name')
    .trim()
    .notEmpty().withMessage('Company Name is required.')
    .isLength({ max: 150 }).withMessage('Company Name cannot exceed 150 characters.'),
  body('address.Email')
    .optional({ checkFalsy: true })
    .isEmail().withMessage('Please provide a valid email address for the client address.'),
  body('contacts')
    .isArray({ min: 1 }).withMessage('At least one Point of Contact (SPOC) is required.'),
  body('contacts.*.SPOCName')
    .trim()
    .notEmpty().withMessage('SPOC contact name is required.'),
  body('contacts.*.Email')
    .optional({ checkFalsy: true })
    .isEmail().withMessage('Please provide a valid email address for the contact SPOC.')
];

export const updateClientValidation = [
  body('Company_Name')
    .trim()
    .notEmpty().withMessage('Company Name is required.')
    .isLength({ max: 150 }).withMessage('Company Name cannot exceed 150 characters.'),
  body('address.Email')
    .optional({ checkFalsy: true })
    .isEmail().withMessage('Please provide a valid email address for the client address.'),
  body('contacts')
    .isArray({ min: 1 }).withMessage('At least one Point of Contact (SPOC) is required.'),
  body('contacts.*.SPOCName')
    .trim()
    .notEmpty().withMessage('SPOC contact name is required.'),
  body('contacts.*.Email')
    .optional({ checkFalsy: true })
    .isEmail().withMessage('Please provide a valid email address for the contact SPOC.'),
  body('deleted')
    .optional()
    .isArray().withMessage('Deleted contacts must be an array.')
];
