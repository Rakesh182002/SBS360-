import * as transportService from '../services/transportService.js';

/**
 * Retrieve list of all active transports
 */
export const getTransports = async (req, res, next) => {
  try {
    const result = await transportService.getAllTransports();
    return res.status(200).json({
      success: true,
      message: 'Transports retrieved successfully.',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieve detailed transport record by ID
 */
export const getTransportDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await transportService.getTransport(parseInt(id, 10));
    return res.status(200).json({
      success: true,
      message: 'Transport details retrieved successfully.',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Register a new transport record
 */
export const createTransport = async (req, res, next) => {
  try {
    const createdBy = req.user.id;
    const transportId = await transportService.createTransport(req.body, createdBy);

    return res.status(201).json({
      success: true,
      message: 'Transport created successfully.',
      data: { transportId }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing transport record
 */
export const updateTransport = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedBy = req.user.id;

    await transportService.updateTransport(parseInt(id, 10), req.body, updatedBy);

    return res.status(200).json({
      success: true,
      message: 'Transport details updated successfully.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Soft-delete an existing transport record
 */
export const deleteTransport = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedBy = req.user.id;

    await transportService.deleteTransport(parseInt(id, 10), updatedBy);

    return res.status(200).json({
      success: true,
      message: 'Transport deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};
