import { body } from 'express-validator';

const commonValidations = [
  body('Vehicle_Name')
    .trim()
    .notEmpty().withMessage('Vehicle Name is required.')
    .isLength({ max: 50 }).withMessage('Vehicle Name cannot exceed 50 characters.'),
  body('Vehicle_Number')
    .trim()
    .notEmpty().withMessage('Vehicle Number is required.')
    .isLength({ max: 50 }).withMessage('Vehicle Number cannot exceed 50 characters.'),
  body('Vehicle_Company')
    .optional({ checkFalsy: true })
    .isLength({ max: 50 }).withMessage('Vehicle Company cannot exceed 50 characters.'),
  body('Vehicle_Model')
    .optional({ checkFalsy: true })
    .isLength({ max: 50 }).withMessage('Vehicle Model cannot exceed 50 characters.'),
  body('Vehicle_Type')
    .optional({ checkFalsy: true })
    .isLength({ max: 50 }).withMessage('Vehicle Type cannot exceed 50 characters.'),
  body('COE_Regn_Number')
    .optional({ checkFalsy: true })
    .isLength({ max: 100 }).withMessage('COE Registration Number cannot exceed 100 characters.'),
  body('RoadTax_Regn_Number')
    .optional({ checkFalsy: true })
    .isLength({ max: 100 }).withMessage('Road Tax Registration Number cannot exceed 100 characters.'),
  body('Insurance_Policy_Number')
    .optional({ checkFalsy: true })
    .isLength({ max: 100 }).withMessage('Insurance Policy Number cannot exceed 100 characters.'),
  body('Insurance_Company')
    .optional({ checkFalsy: true })
    .isLength({ max: 80 }).withMessage('Insurance Company cannot exceed 80 characters.'),
  body('AgreementNumber')
    .optional({ checkFalsy: true })
    .isLength({ max: 150 }).withMessage('Agreement Number cannot exceed 150 characters.')
];

export const createTransportValidation = [...commonValidations];
export const updateTransportValidation = [...commonValidations];
