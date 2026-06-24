import * as supplierService from '../services/supplierService.js';

/**
 * Get list of all active suppliers
 */
export const getSuppliers = async (req, res, next) => {
  try {
    const result = await supplierService.getAllSuppliers();
    return res.status(200).json({
      success: true,
      message: 'Suppliers retrieved successfully.',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get supplier details by ID
 */
export const getSupplierDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await supplierService.getSupplier(parseInt(id, 10));
    return res.status(200).json({
      success: true,
      message: 'Supplier details retrieved successfully.',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Register a new supplier profile
 */
export const createSupplier = async (req, res, next) => {
  try {
    const { Company_Name, IndustryID, Spoc_Name, Supplier_Description, address } = req.body;
    const userId = req.user.id;

    const supplierData = { Company_Name, IndustryID, Spoc_Name, Supplier_Description };
    const addressData = address || {};

    const supplierId = await supplierService.createSupplier(supplierData, addressData, userId);

    return res.status(201).json({
      success: true,
      message: 'Supplier registered successfully.',
      data: { supplierId }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing supplier profile
 */
export const updateSupplier = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { Company_Name, IndustryID, Spoc_Name, Supplier_Description, address } = req.body;
    const userId = req.user.id;

    const supplierId = parseInt(id, 10);
    const supplierData = { Company_Name, IndustryID, Spoc_Name, Supplier_Description };
    const addressData = address || {};

    await supplierService.updateSupplier(supplierId, supplierData, addressData, userId);

    return res.status(200).json({
      success: true,
      message: 'Supplier details updated successfully.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Soft delete a supplier profile
 */
export const deleteSupplier = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await supplierService.deleteSupplier(parseInt(id, 10), userId);

    return res.status(200).json({
      success: true,
      message: 'Supplier deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get industries for selection menu options
 */
export const getIndustries = async (req, res, next) => {
  try {
    const result = await supplierService.getAllIndustries();
    return res.status(200).json({
      success: true,
      message: 'Industries retrieved successfully.',
      data: result
    });
  } catch (error) {
    next(error);
  }
};
