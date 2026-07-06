import * as safetyDao from '../Dao/safetyDao.js';
import fs from 'fs';
import path from 'path';

/**
 * Hazards, PPE, and Inspection checklist items
 */
export const getHazards = async () => {
  return await safetyDao.getAllHazards();
};

export const getPpes = async () => {
  return await safetyDao.getAllPPEs();
};

export const getSafetyInspectionItems = async () => {
  return await safetyDao.getAllSafetyInspectionItems();
};

export const getProjects = async () => {
  return await safetyDao.getAllProjects();
};

/**
 * Safety Master declarations
 */
export const getAllSafetys = async () => {
  return await safetyDao.getAllSafetys();
};

export const getSafety = async (safetyId) => {
  const safety = await safetyDao.getSafetyById(safetyId);
  if (!safety) {
    throw { statusCode: 404, message: 'Safety record not found.' };
  }
  return safety;
};

export const createSafety = async (data, submittedBy) => {
  return await safetyDao.createSafetyTransaction(data, submittedBy);
};

export const updateSafety = async (safetyId, data, updatedBy) => {
  const safety = await safetyDao.getSafetyById(safetyId);
  if (!safety) {
    throw { statusCode: 404, message: 'Safety record not found.' };
  }
  return await safetyDao.updateSafetyTransaction(safetyId, data, updatedBy);
};

export const deleteSafety = async (safetyId) => {
  const safety = await safetyDao.getSafetyById(safetyId);
  if (!safety) {
    throw { statusCode: 404, message: 'Safety record not found.' };
  }
  return await safetyDao.deleteSafetyTransaction(safetyId);
};

/**
 * Safety Inspections (SI)
 */
export const getAllSafetyInspections = async () => {
  return await safetyDao.getAllSafetyInspections();
};

export const getSafetyInspection = async (safInsId) => {
  const si = await safetyDao.getSafetyInspectionById(safInsId);
  if (!si) {
    throw { statusCode: 404, message: 'Safety inspection checklist record not found.' };
  }
  return si;
};

export const createSafetyInspection = async (data, createdBy) => {
  return await safetyDao.createSafetyInspectionTransaction(data, createdBy);
};

export const updateSafetyInspection = async (safInsId, data, updatedBy) => {
  const si = await safetyDao.getSafetyInspectionById(safInsId);
  if (!si) {
    throw { statusCode: 404, message: 'Safety inspection checklist record not found.' };
  }
  return await safetyDao.updateSafetyInspectionTransaction(safInsId, data, updatedBy);
};

/**
 * ESH Safety Inspections (New SI)
 */
export const getAllEhsInspections = async () => {
  return await safetyDao.getAllEhsInspections();
};

export const getEhsInspection = async (nsiId) => {
  const ehs = await safetyDao.getEhsInspectionById(nsiId);
  if (!ehs) {
    throw { statusCode: 404, message: 'EHS inspection record not found.' };
  }
  return ehs;
};

export const createEhsInspection = async (data, createdBy) => {
  // If file data is provided as base64, save it to disk
  if (data.fileData && data.fileName) {
    const uploadDir = path.join(process.cwd(), 'uploads', 'safety');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const ext = path.extname(data.fileName);
    const uniqueName = `SI_EHS_${Date.now()}${ext}`;
    const filePath = path.join(uploadDir, uniqueName);
    
    const buffer = Buffer.from(data.fileData, 'base64');
    fs.writeFileSync(filePath, buffer);
    
    data.FileName = data.fileName;
    data.FilePath = `/uploads/safety/${uniqueName}`;
    data.FileCaption = uniqueName;
  }
  
  return await safetyDao.createEhsInspection(data, createdBy);
};

export const updateEhsInspection = async (nsiId, data, updatedBy) => {
  const ehs = await safetyDao.getEhsInspectionById(nsiId);
  if (!ehs) {
    throw { statusCode: 404, message: 'EHS inspection record not found.' };
  }
  
  // If new file data is provided as base64, save it to disk
  if (data.fileData && data.fileName) {
    const uploadDir = path.join(process.cwd(), 'uploads', 'safety');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const ext = path.extname(data.fileName);
    const uniqueName = `SI_EHS_${Date.now()}${ext}`;
    const filePath = path.join(uploadDir, uniqueName);
    
    const buffer = Buffer.from(data.fileData, 'base64');
    fs.writeFileSync(filePath, buffer);
    
    data.FileName = data.fileName;
    data.FilePath = `/uploads/safety/${uniqueName}`;
    data.FileCaption = uniqueName;
  }
  return await safetyDao.updateEhsInspection(nsiId, data, updatedBy);
};
export const getPtws = async () => {
  return await safetyDao.getAllPtws();
};

export const getPtwChecklistConfig = async (ptwType) => {
  return await safetyDao.getPtwChecklistConfig(ptwType);
};

export const getPtwById = async (ptwId, ptwType) => {
  return await safetyDao.getPtwDetails(ptwId, ptwType);
};

export const createPtw = async (data, createdBy) => {
  return await safetyDao.createPtw(data, createdBy);
};

export const updatePtw = async (ptwId, data, updatedBy) => {
  return await safetyDao.updatePtw(ptwId, data, updatedBy);
};

export const deletePtw = async (ptwId, ptwType) => {
  return await safetyDao.deletePtw(ptwId, ptwType);
};
