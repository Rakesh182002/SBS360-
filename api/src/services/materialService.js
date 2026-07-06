import * as materialDao from '../Dao/materialDao.js';

/**
 * Stores Service
 */
export const getAllStores = async () => {
  return await materialDao.getAllStores();
};

export const getStore = async (storeId) => {
  const store = await materialDao.getStoreById(storeId);
  if (!store) {
    throw { statusCode: 404, message: 'Store not found.' };
  }
  return store;
};

export const createStore = async (storeData, createdBy) => {
  // Query all active CITI-ST codes to find the maximum suffix number
  const existingStoreRows = await materialDao.getLatestStoreCodes();
  let maxNum = 0; // Default starting suffix if none exists
  
  if (existingStoreRows && existingStoreRows.length > 0) {
    existingStoreRows.forEach(row => {
      const code = row.Store_Code || '';
      // Extract numeric suffix from CITI-ST*** format
      const match = code.match(/^CITI-ST(\d+)$/i);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) {
          maxNum = num;
        }
      }
    });
  }
  
  // Increment to get the next sequential number (starts at 1 if none existed)
  const nextNum = maxNum + 1;
  const nextStoreCode = `CITI-ST${String(nextNum).padStart(3, '0')}`;
  
  const finalStoreData = {
    ...storeData,
    Store_Code: nextStoreCode
  };

  return await materialDao.insertStore(finalStoreData, createdBy);
};

export const updateStore = async (storeId, storeData, updatedBy) => {
  const store = await materialDao.getStoreById(storeId);
  if (!store) {
    throw { statusCode: 404, message: 'Store not found.' };
  }
  return await materialDao.updateStore(storeId, storeData, updatedBy);
};

export const deleteStore = async (storeId) => {
  const store = await materialDao.getStoreById(storeId);
  if (!store) {
    throw { statusCode: 404, message: 'Store not found.' };
  }
  try {
    await materialDao.deleteStore(storeId);
    return true;
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      throw {
        statusCode: 400,
        message: 'Cannot delete store because it is referenced by active transactions (Inward, Outward, or Stock Taking).'
      };
    }
    throw error;
  }
};


/**
 * Inward Service
 */
export const getAllInwards = async () => {
  return await materialDao.getAllInwards();
};

export const getInward = async (inwardId) => {
  const inward = await materialDao.getInwardById(inwardId);
  if (!inward) {
    throw { statusCode: 404, message: 'Inward receipt not found.' };
  }
  return inward;
};

export const createInward = async (inwardData, descriptionsList, createdBy) => {
  if (!descriptionsList || !Array.isArray(descriptionsList) || descriptionsList.length === 0) {
    throw { statusCode: 400, message: 'Inward items list must contain at least one item.' };
  }
  return await materialDao.createInwardTransaction(inwardData, descriptionsList, createdBy);
};

export const updateInward = async (inwardId, inwardData, descriptionsList, updatedBy) => {
  const inward = await materialDao.getInwardById(inwardId);
  if (!inward) {
    throw { statusCode: 404, message: 'Inward receipt not found.' };
  }
  if (!descriptionsList || !Array.isArray(descriptionsList) || descriptionsList.length === 0) {
    throw { statusCode: 400, message: 'Inward items list must contain at least one item.' };
  }
  return await materialDao.updateInwardTransaction(inwardId, inwardData, descriptionsList, updatedBy);
};


/**
 * Outward Service
 */
export const getAllOutwards = async () => {
  return await materialDao.getAllOutwards();
};

export const getOutward = async (outwardId) => {
  const outward = await materialDao.getOutwardById(outwardId);
  if (!outward) {
    throw { statusCode: 404, message: 'Outward delivery order not found.' };
  }
  return outward;
};

export const createOutward = async (outwardData, descriptionsList, createdBy) => {
  if (!descriptionsList || !Array.isArray(descriptionsList) || descriptionsList.length === 0) {
    throw { statusCode: 400, message: 'Outward items list must contain at least one item.' };
  }
  return await materialDao.createOutwardTransaction(outwardData, descriptionsList, createdBy);
};

export const updateOutward = async (outwardId, outwardData, descriptionsList, updatedBy) => {
  const outward = await materialDao.getOutwardById(outwardId);
  if (!outward) {
    throw { statusCode: 404, message: 'Outward delivery order not found.' };
  }
  if (!descriptionsList || !Array.isArray(descriptionsList) || descriptionsList.length === 0) {
    throw { statusCode: 400, message: 'Outward items list must contain at least one item.' };
  }
  return await materialDao.updateOutwardTransaction(outwardId, outwardData, descriptionsList, updatedBy);
};


/**
 * Stock Summary Service
 */
export const getStock = async () => {
  return await materialDao.getStockSummary();
};

export const getCurrentStock = async (productId, storeId) => {
  return await materialDao.getCurrentStock(productId, storeId);
};


/**
 * Stock Adjustments Service
 */
export const getAllStockAdjustments = async () => {
  return await materialDao.getAllStockAdjusts();
};

export const getStockAdjustment = async (stockAdjId) => {
  const adj = await materialDao.getStockAdjustById(stockAdjId);
  if (!adj) {
    throw { statusCode: 404, message: 'Stock adjustment record not found.' };
  }
  return adj;
};

export const createStockAdjustment = async (stockAdjData, createdBy) => {
  return await materialDao.createStockAdjustmentTransaction(stockAdjData, createdBy);
};


/**
 * Report Service
 */
export const getInwardReport = async (filter) => {
  return await materialDao.getFilterInwardReports(filter);
};

export const getOutwardReport = async (filter) => {
  return await materialDao.getFilterOutwardReports(filter);
};
