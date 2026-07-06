import * as safetyService from '../services/safetyService.js';

/**
 * Metadata dropdown APIs
 */
export const getHazards = async (req, res, next) => {
  try {
    const result = await safetyService.getHazards();
    return res.status(200).json({
      success: true,
      message: 'Hazards retrieved successfully.',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const getPpes = async (req, res, next) => {
  try {
    const result = await safetyService.getPpes();
    return res.status(200).json({
      success: true,
      message: 'PPE list retrieved successfully.',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const getSafetyInspectionItems = async (req, res, next) => {
  try {
    const result = await safetyService.getSafetyInspectionItems();
    return res.status(200).json({
      success: true,
      message: 'Inspection checklist items retrieved successfully.',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const getProjects = async (req, res, next) => {
  try {
    const result = await safetyService.getProjects();
    return res.status(200).json({
      success: true,
      message: 'Projects retrieved successfully.',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Safety Master Declarations
 */
export const getSafetys = async (req, res, next) => {
  try {
    const result = await safetyService.getAllSafetys();
    return res.status(200).json({
      success: true,
      message: 'Safety records retrieved successfully.',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const getSafetyDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await safetyService.getSafety(parseInt(id, 10));
    return res.status(200).json({
      success: true,
      message: 'Safety record details retrieved successfully.',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const createSafety = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const safetyId = await safetyService.createSafety(req.body, userId);
    return res.status(201).json({
      success: true,
      message: 'Safety record created successfully.',
      data: { safetyId }
    });
  } catch (error) {
    next(error);
  }
};

export const updateSafety = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    await safetyService.updateSafety(parseInt(id, 10), req.body, userId);
    return res.status(200).json({
      success: true,
      message: 'Safety record updated successfully.'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSafety = async (req, res, next) => {
  try {
    const { id } = req.params;
    await safetyService.deleteSafety(parseInt(id, 10));
    return res.status(200).json({
      success: true,
      message: 'Safety record deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Safety Inspections (SI)
 */
export const getSafetyInspections = async (req, res, next) => {
  try {
    const result = await safetyService.getAllSafetyInspections();
    return res.status(200).json({
      success: true,
      message: 'Safety inspections retrieved successfully.',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const getSafetyInspectionDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await safetyService.getSafetyInspection(parseInt(id, 10));
    return res.status(200).json({
      success: true,
      message: 'Safety inspection details retrieved successfully.',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const createSafetyInspection = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const safInsId = await safetyService.createSafetyInspection(req.body, userId);
    return res.status(201).json({
      success: true,
      message: 'Safety inspection created successfully.',
      data: { safInsId }
    });
  } catch (error) {
    next(error);
  }
};

export const updateSafetyInspection = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    await safetyService.updateSafetyInspection(parseInt(id, 10), req.body, userId);
    return res.status(200).json({
      success: true,
      message: 'Safety inspection updated successfully.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * ESH Safety Inspections (New SI)
 */
export const getEhsInspections = async (req, res, next) => {
  try {
    const result = await safetyService.getAllEhsInspections();
    return res.status(200).json({
      success: true,
      message: 'EHS inspections retrieved successfully.',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const getEhsInspectionDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await safetyService.getEhsInspection(parseInt(id, 10));
    return res.status(200).json({
      success: true,
      message: 'EHS inspection details retrieved successfully.',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const createEhsInspection = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const nsiId = await safetyService.createEhsInspection(req.body, userId);
    return res.status(201).json({
      success: true,
      message: 'EHS inspection created successfully.',
      data: { nsiId }
    });
  } catch (error) {
    next(error);
  }
};

export const updateEhsInspection = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    await safetyService.updateEhsInspection(parseInt(id, 10), req.body, userId);
    return res.status(200).json({
      success: true,
      message: 'EHS inspection updated successfully.'
    });
  } catch (error) {
    next(error);
  }
};

export const getPtws = async (req, res, next) => {
  try {
    const result = await safetyService.getPtws();
    return res.status(200).json({
      success: true,
      message: 'PTW list retrieved successfully.',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const getPtwChecklistConfig = async (req, res, next) => {
  try {
    const { type } = req.params;
    const result = await safetyService.getPtwChecklistConfig(type);
    return res.status(200).json({
      success: true,
      message: 'PTW checklist configuration retrieved successfully.',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const getPtwDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { type } = req.query;
    const result = await safetyService.getPtwById(parseInt(id, 10), type);
    return res.status(200).json({
      success: true,
      message: 'PTW details retrieved successfully.',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const createPtw = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const ptwId = await safetyService.createPtw(req.body, userId);
    return res.status(201).json({
      success: true,
      message: 'Permit to Work created successfully.',
      data: { ptwId }
    });
  } catch (error) {
    next(error);
  }
};

export const updatePtw = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    await safetyService.updatePtw(parseInt(id, 10), req.body, userId);
    return res.status(200).json({
      success: true,
      message: 'Permit to Work updated successfully.'
    });
  } catch (error) {
    next(error);
  }
};

export const deletePtw = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { type } = req.query;
    await safetyService.deletePtw(parseInt(id, 10), type);
    return res.status(200).json({
      success: true,
      message: 'Permit to Work deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};
