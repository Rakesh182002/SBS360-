import * as materialService from '../services/materialService.js';

/**
 * Stores Controller
 */
export const getStores = async (req, res, next) => {
  try {
    const result = await materialService.getAllStores();
    return res.status(200).json({
      success: true,
      message: 'Stores retrieved successfully.',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const getStoreDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await materialService.getStore(parseInt(id, 10));
    return res.status(200).json({
      success: true,
      message: 'Store details retrieved successfully.',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const createStore = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const storeId = await materialService.createStore(req.body, userId);
    return res.status(201).json({
      success: true,
      message: 'Store created successfully.',
      data: { storeId }
    });
  } catch (error) {
    next(error);
  }
};

export const updateStore = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    await materialService.updateStore(parseInt(id, 10), req.body, userId);
    return res.status(200).json({
      success: true,
      message: 'Store updated successfully.'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteStore = async (req, res, next) => {
  try {
    const { id } = req.params;
    await materialService.deleteStore(parseInt(id, 10));
    return res.status(200).json({
      success: true,
      message: 'Store deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};


/**
 * Inwards Controller
 */
export const getInwards = async (req, res, next) => {
  try {
    const result = await materialService.getAllInwards();
    return res.status(200).json({
      success: true,
      message: 'Inward transactions retrieved successfully.',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const getInwardDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await materialService.getInward(parseInt(id, 10));
    return res.status(200).json({
      success: true,
      message: 'Inward transaction details retrieved successfully.',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const createInward = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { inwardDescription, ...inwardData } = req.body;
    const inwardId = await materialService.createInward(inwardData, inwardDescription, userId);
    return res.status(201).json({
      success: true,
      message: 'Inward transaction created successfully.',
      data: { inwardId }
    });
  } catch (error) {
    next(error);
  }
};

export const updateInward = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { inwardDescription, ...inwardData } = req.body;
    await materialService.updateInward(parseInt(id, 10), inwardData, inwardDescription, userId);
    return res.status(200).json({
      success: true,
      message: 'Inward transaction updated successfully.'
    });
  } catch (error) {
    next(error);
  }
};


/**
 * Outwards Controller
 */
export const getOutwards = async (req, res, next) => {
  try {
    const result = await materialService.getAllOutwards();
    return res.status(200).json({
      success: true,
      message: 'Outward transactions retrieved successfully.',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const getOutwardDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await materialService.getOutward(parseInt(id, 10));
    return res.status(200).json({
      success: true,
      message: 'Outward transaction details retrieved successfully.',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const createOutward = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { outwardDescription, ...outwardData } = req.body;
    const outwardId = await materialService.createOutward(outwardData, outwardDescription, userId);
    return res.status(201).json({
      success: true,
      message: 'Outward transaction created successfully.',
      data: { outwardId }
    });
  } catch (error) {
    next(error);
  }
};

export const updateOutward = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { outwardDescription, ...outwardData } = req.body;
    await materialService.updateOutward(parseInt(id, 10), outwardData, outwardDescription, userId);
    return res.status(200).json({
      success: true,
      message: 'Outward transaction updated successfully.'
    });
  } catch (error) {
    next(error);
  }
};


/**
 * Stocks Controller
 */
export const getStockSummary = async (req, res, next) => {
  try {
    const result = await materialService.getStock();
    return res.status(200).json({
      success: true,
      message: 'Stock summary retrieved successfully.',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentStock = async (req, res, next) => {
  try {
    const { productId, storeId } = req.query;
    if (!productId || !storeId) {
      throw { statusCode: 400, message: 'Both productId and storeId query parameters are required.' };
    }
    const count = await materialService.getCurrentStock(parseInt(productId, 10), parseInt(storeId, 10));
    return res.status(200).json({
      success: true,
      message: 'Current stock count retrieved successfully.',
      data: { stock: count }
    });
  } catch (error) {
    next(error);
  }
};


/**
 * Stock Adjustments Controller
 */
export const getStockAdjustments = async (req, res, next) => {
  try {
    const result = await materialService.getAllStockAdjustments();
    return res.status(200).json({
      success: true,
      message: 'Stock adjustments retrieved successfully.',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const getStockAdjustmentDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await materialService.getStockAdjustment(parseInt(id, 10));
    return res.status(200).json({
      success: true,
      message: 'Stock adjustment details retrieved successfully.',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const createStockAdjustment = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const stockAdjId = await materialService.createStockAdjustment(req.body, userId);
    return res.status(201).json({
      success: true,
      message: 'Stock adjustment created successfully.',
      data: { stockAdjId }
    });
  } catch (error) {
    next(error);
  }
};


/**
 * Reports Controller
 */
export const getInwardReport = async (req, res, next) => {
  try {
    const result = await materialService.getInwardReport(req.body);
    return res.status(200).json({
      success: true,
      message: 'Filtered inward reports retrieved successfully.',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const getOutwardReport = async (req, res, next) => {
  try {
    const result = await materialService.getOutwardReport(req.body);
    return res.status(200).json({
      success: true,
      message: 'Filtered outward reports retrieved successfully.',
      data: result
    });
  } catch (error) {
    next(error);
  }
};
