import { body } from 'express-validator';

const commonValidations = [
  body('Product_Name')
    .trim()
    .notEmpty().withMessage('Product Name is required.')
    .isLength({ max: 150 }).withMessage('Product Name cannot exceed 150 characters.'),
  body('Product_Type')
    .optional({ checkFalsy: true })
    .isLength({ max: 100 }).withMessage('Product Type cannot exceed 100 characters.'),
  body('Product_Company_Name')
    .optional({ checkFalsy: true })
    .isLength({ max: 150 }).withMessage('Product Company Name cannot exceed 150 characters.'),
  body('Product_Description')
    .optional({ checkFalsy: true })
    .isLength({ max: 250 }).withMessage('Product Description cannot exceed 250 characters.'),
  body('Dimension')
    .optional({ checkFalsy: true })
    .isLength({ max: 50 }).withMessage('Dimension cannot exceed 50 characters.'),
  body('Measuring_Unit')
    .optional({ checkFalsy: true })
    .isLength({ max: 50 }).withMessage('Measuring Unit cannot exceed 50 characters.'),
  body('Unit_Price')
    .optional({ checkFalsy: true })
    .isFloat({ min: 0 }).withMessage('Unit Price must be a positive number.'),
  body('Product_Code')
    .optional({ checkFalsy: true })
    .isLength({ max: 50 }).withMessage('Product Code cannot exceed 50 characters.'),
  body('Barcode1')
    .optional({ checkFalsy: true })
    .isLength({ max: 250 }).withMessage('Barcode1 cannot exceed 250 characters.'),
  body('Barcode2')
    .optional({ checkFalsy: true })
    .isLength({ max: 250 }).withMessage('Barcode2 cannot exceed 250 characters.')
];

export const createProductValidation = [...commonValidations];
export const updateProductValidation = [...commonValidations];
