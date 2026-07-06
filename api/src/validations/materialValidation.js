import { body } from 'express-validator';

export const storeValidation = [
  body('Store_Name')
    .trim()
    .notEmpty().withMessage('Store Name is required.')
    .isLength({ max: 150 }).withMessage('Store Name cannot exceed 150 characters.'),
  body('Store_Code')
    .optional({ checkFalsy: true })
    .isLength({ max: 50 }).withMessage('Store Code cannot exceed 50 characters.'),
  body('Branch_Name')
    .optional({ checkFalsy: true })
    .isLength({ max: 50 }).withMessage('Branch Name cannot exceed 50 characters.'),
  body('Start_Date')
    .optional({ checkFalsy: true })
    .isISO8601().withMessage('Start Date must be a valid date (YYYY-MM-DD).'),
  body('Store_Description')
    .optional({ checkFalsy: true })
    .isLength({ max: 250 }).withMessage('Store Description cannot exceed 250 characters.'),
  body('Incharge_Name')
    .optional({ checkFalsy: true })
    .isLength({ max: 80 }).withMessage('Incharge Name cannot exceed 80 characters.'),
  body('Remarks')
    .optional({ checkFalsy: true })
    .isLength({ max: 250 }).withMessage('Remarks cannot exceed 250 characters.')
];

export const inwardValidation = [
  body('StoreID')
    .notEmpty().withMessage('Store is required.')
    .isInt({ min: 1 }).withMessage('Valid Store ID is required.'),
  body('SupplierID')
    .notEmpty().withMessage('Supplier is required.')
    .isInt().withMessage('Valid Supplier ID is required.'),
  body('Inward_Number')
    .optional({ checkFalsy: true })
    .isLength({ max: 50 }).withMessage('Inward Number cannot exceed 50 characters.'),
  body('Branch_Name')
    .optional({ checkFalsy: true })
    .isLength({ max: 50 }).withMessage('Branch Name cannot exceed 50 characters.'),
  body('Invoice_or_DO_Number')
    .optional({ checkFalsy: true })
    .isLength({ max: 150 }).withMessage('Invoice or DO Number cannot exceed 150 characters.'),
  body('Invoice_or_DO_Date')
    .optional({ checkFalsy: true })
    .isISO8601().withMessage('Invoice/DO Date must be a valid date (YYYY-MM-DD).'),
  body('Received_Date')
    .optional({ checkFalsy: true })
    .isISO8601().withMessage('Received Date must be a valid date (YYYY-MM-DD).'),
  body('ReceivedBy')
    .optional({ checkFalsy: true })
    .isInt({ min: 1 }).withMessage('Received By must be a valid Employee ID.'),
  body('DraftFlag')
    .notEmpty().withMessage('Draft Flag is required.')
    .isIn([0, 1]).withMessage('Draft Flag must be 0 or 1.'),
  body('inwardDescription')
    .isArray({ min: 1 }).withMessage('At least one item description must be provided.'),
  body('inwardDescription.*.ProductID')
    .isInt({ min: 1 }).withMessage('Valid Product ID is required for each item.'),
  body('inwardDescription.*.Quantity')
    .isInt({ min: 1 }).withMessage('Quantity must be at least 1 for each item.'),
  body('inwardDescription.*.UoM')
    .trim()
    .notEmpty().withMessage('Unit of Measure is required for each item.')
];

export const outwardValidation = [
  body('StoreID')
    .notEmpty().withMessage('Store is required.')
    .isInt({ min: 1 }).withMessage('Valid Store ID is required.'),
  body('ClientID')
    .notEmpty().withMessage('Client is required.')
    .isInt().withMessage('Valid Client ID is required.'),
  body('Outward_Number')
    .optional({ checkFalsy: true })
    .isLength({ max: 50 }).withMessage('Outward Number cannot exceed 50 characters.'),
  body('Branch_Name')
    .optional({ checkFalsy: true })
    .isLength({ max: 50 }).withMessage('Branch Name cannot exceed 50 characters.'),
  body('DO_Number')
    .optional({ checkFalsy: true })
    .isLength({ max: 150 }).withMessage('DO Number cannot exceed 150 characters.'),
  body('DO_Date')
    .optional({ checkFalsy: true })
    .isISO8601().withMessage('DO Date must be a valid date (YYYY-MM-DD).'),
  body('Delivery_Date')
    .optional({ checkFalsy: true })
    .isISO8601().withMessage('Delivery Date must be a valid date (YYYY-MM-DD).'),
  body('Vehicle_Number')
    .optional({ checkFalsy: true })
    .isLength({ max: 50 }).withMessage('Vehicle Number cannot exceed 50 characters.'),
  body('Delivery_Mode')
    .optional({ checkFalsy: true })
    .isLength({ max: 80 }).withMessage('Delivery Mode cannot exceed 80 characters.'),
  body('Project_Location')
    .optional({ checkFalsy: true })
    .isLength({ max: 80 }).withMessage('Project Location cannot exceed 80 characters.'),
  body('DeliveredBy')
    .optional({ checkFalsy: true })
    .isInt({ min: 1 }).withMessage('Delivered By must be a valid Employee ID.'),
  body('DraftFlag')
    .notEmpty().withMessage('Draft Flag is required.')
    .isIn([0, 1]).withMessage('Draft Flag must be 0 or 1.'),
  body('outwardDescription')
    .isArray({ min: 1 }).withMessage('At least one item description must be provided.'),
  body('outwardDescription.*.ProductID')
    .isInt({ min: 1 }).withMessage('Valid Product ID is required for each item.'),
  body('outwardDescription.*.Quantity')
    .isInt({ min: 1 }).withMessage('Quantity must be at least 1 for each item.'),
  body('outwardDescription.*.UoM')
    .trim()
    .notEmpty().withMessage('Unit of Measure is required for each item.')
];

export const stockAdjustmentValidation = [
  body('StoreID')
    .notEmpty().withMessage('Store is required.')
    .isInt({ min: 1 }).withMessage('Valid Store ID is required.'),
  body('ProductID')
    .notEmpty().withMessage('Product is required.')
    .isInt({ min: 1 }).withMessage('Valid Product ID is required.'),
  body('Quantity')
    .notEmpty().withMessage('Quantity is required.')
    .isInt({ min: 1 }).withMessage('Quantity must be at least 1.'),
  body('AdjType')
    .notEmpty().withMessage('Adjustment Type is required.')
    .isIn([1, 2]).withMessage('Adjustment Type must be 1 (Decrease) or 2 (Increase).'),
  body('Stock_Taking_Date')
    .optional({ checkFalsy: true })
    .isISO8601().withMessage('Stock Taking Date must be a valid date (YYYY-MM-DD).'),
  body('Adj_Ref_Date')
    .optional({ checkFalsy: true })
    .isISO8601().withMessage('Adjustment Reference Date must be a valid date (YYYY-MM-DD).'),
  body('Stock_Taken_By')
    .notEmpty().withMessage('Stock Taken By is required.')
    .isInt({ min: 1 }).withMessage('Stock Taken By must be a valid Employee ID.'),
  body('Stock_Taking_Number')
    .optional({ checkFalsy: true })
    .isLength({ max: 50 }).withMessage('Stock Taking Number cannot exceed 50 characters.'),
  body('Adj_Ref_Number')
    .optional({ checkFalsy: true })
    .isLength({ max: 50 }).withMessage('Adjustment Reference Number cannot exceed 50 characters.'),
  body('Branch_Name')
    .optional({ checkFalsy: true })
    .isLength({ max: 80 }).withMessage('Branch Name cannot exceed 80 characters.')
];
