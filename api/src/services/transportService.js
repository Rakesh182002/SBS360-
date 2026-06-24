import * as transportDao from '../Dao/transportDao.js';

// Helper to format date inputs safely to YYYY-MM-DD or null
const sanitizeDate = (dateVal) => {
  if (!dateVal) return null;
  const cleaned = String(dateVal).trim();
  if (cleaned === '' || cleaned === 'null') return null;
  
  // If date is in dd/MM/yyyy format (as returned by some legacy operations), reformat it
  const dmyMatch = cleaned.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (dmyMatch) {
    return `${dmyMatch[3]}-${dmyMatch[2]}-${dmyMatch[1]}`;
  }
  
  // Otherwise parse standard date string
  try {
    const d = new Date(cleaned);
    if (!isNaN(d.getTime())) {
      return d.toISOString().split('T')[0];
    }
  } catch (e) {
    // Ignore and return original or null
  }
  return cleaned;
};

const formatTransportDates = (data) => {
  const dateFields = [
    'COE_Issue_Date', 'COE_Expiry_Date', 
    'RoadTax_Issue_Date', 'RoadTax_Expiry_Date', 
    'Insurance_Issue_Date', 'Insurance_Expiry_Date', 
    'Last_Insurance_Renew_Date', 'Vehicle_Inspection_Date', 
    'Inspection_Due_Date'
  ];
  const formatted = { ...data };
  for (const field of dateFields) {
    if (formatted[field] !== undefined) {
      formatted[field] = sanitizeDate(formatted[field]);
    }
  }
  return formatted;
};

/**
 * Get list of all active transport records
 */
export const getAllTransports = async () => {
  const rows = await transportDao.getAllTransports();
  
  // Map RoadTax_Iussue_Date back to RoadTax_Issue_Date for API uniformity
  return rows.map(r => ({
    ...r,
    RoadTax_Issue_Date: r.RoadTax_Iussue_Date
  }));
};

/**
 * Get details of a single transport record by ID
 */
export const getTransport = async (transportId) => {
  const row = await transportDao.getTransportById(transportId);
  if (!row) {
    throw { statusCode: 404, message: 'Transport record not found.' };
  }
  return {
    ...row,
    RoadTax_Issue_Date: row.RoadTax_Iussue_Date
  };
};

/**
 * Create a new transport record
 */
export const createTransport = async (transportData, createdBy) => {
  const formattedData = formatTransportDates(transportData);
  return await transportDao.createTransport(formattedData, createdBy);
};

/**
 * Update an existing transport record
 */
export const updateTransport = async (transportId, transportData, updatedBy) => {
  const record = await transportDao.getTransportById(transportId);
  if (!record) {
    throw { statusCode: 404, message: 'Transport record not found.' };
  }
  const formattedData = formatTransportDates(transportData);
  return await transportDao.saveTransport(transportId, formattedData, updatedBy);
};

/**
 * Soft delete a transport record
 */
export const deleteTransport = async (transportId, updatedBy) => {
  const record = await transportDao.getTransportById(transportId);
  if (!record) {
    throw { statusCode: 404, message: 'Transport record not found.' };
  }
  await transportDao.deleteTransport(transportId, updatedBy);
  return true;
};
