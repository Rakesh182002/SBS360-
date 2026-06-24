import * as supplierDao from '../Dao/supplierDao.js';

/**
 * Get all active suppliers
 */
export const getAllSuppliers = async () => {
  return await supplierDao.getAllSuppliers();
};

/**
 * Get details of a single supplier profile by ID
 */
export const getSupplier = async (supplierId) => {
  const supplier = await supplierDao.getSupplierById(supplierId);
  if (!supplier) {
    throw { statusCode: 404, message: 'Supplier not found.' };
  }
  return supplier;
};

/**
 * Handle new supplier registration inside a transaction
 */
export const createSupplier = async (supplierData, addressData, createdBy) => {
  if (!supplierData.Company_Name) {
    throw { statusCode: 400, message: 'Company Name is required.' };
  }
  return await supplierDao.createSupplierTransaction(supplierData, addressData, createdBy);
};

/**
 * Handle supplier profile updates inside a transaction
 */
export const updateSupplier = async (supplierId, supplierData, addressData, updatedBy) => {
  const supplier = await supplierDao.getSupplierById(supplierId);
  if (!supplier) {
    throw { statusCode: 404, message: 'Supplier not found.' };
  }
  return await supplierDao.saveSupplierTransaction(supplierId, supplierData, addressData, updatedBy);
};

/**
 * Soft delete a supplier profile
 */
export const deleteSupplier = async (supplierId, updatedBy) => {
  const supplier = await supplierDao.getSupplierById(supplierId);
  if (!supplier) {
    throw { statusCode: 404, message: 'Supplier not found.' };
  }
  await supplierDao.deleteSupplier(supplierId, updatedBy);
  return true;
};

/**
 * Retrieve list of all industries
 */
export const getAllIndustries = async () => {
  return await supplierDao.getAllIndustries();
};
