import { query } from '../models/dbModel.js';

/**
 * Get all active transport records
 */
export const getAllTransports = async () => {
  const sql = 'SELECT * FROM eng_transport_master WHERE IsActive = 1';
  return await query(sql);
};

/**
 * Get details of a single transport record by ID
 */
export const getTransportById = async (transportId) => {
  const sql = 'SELECT * FROM eng_transport_master WHERE TransportID = ? AND IsActive = 1';
  const rows = await query(sql, [transportId]);
  return rows.length > 0 ? rows[0] : null;
};

/**
 * Create a new transport record
 */
export const createTransport = async (data, createdBy) => {
  const sql = `
    INSERT INTO eng_transport_master (
      Vehicle_Name, Vehicle_Company, Vehicle_Model, Vehicle_Type, Vehicle_Number,
      COE_Regn_Number, COE_Issue_Date, COE_Expiry_Date,
      RoadTax_Regn_Number, RoadTax_Iussue_Date, RoadTax_Expiry_Date,
      Insurance_Policy_Number, Insurance_Issue_Date, Insurance_Expiry_Date, Insurance_Company,
      Last_Insurance_Renew_Date, Vehicle_Inspection_Date, Inspection_Due_Date,
      Remarks, AgreementNumber, CreatedDate, CreatedBy, IsActive
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, 1)
  `;

  const params = [
    data.Vehicle_Name || null,
    data.Vehicle_Company || null,
    data.Vehicle_Model || null,
    data.Vehicle_Type || null,
    data.Vehicle_Number || null,
    data.COE_Regn_Number || null,
    data.COE_Issue_Date || null,
    data.COE_Expiry_Date || null,
    data.RoadTax_Regn_Number || null,
    data.RoadTax_Issue_Date || null, // maps to RoadTax_Iussue_Date in DB
    data.RoadTax_Expiry_Date || null,
    data.Insurance_Policy_Number || null,
    data.Insurance_Issue_Date || null,
    data.Insurance_Expiry_Date || null,
    data.Insurance_Company || null,
    data.Last_Insurance_Renew_Date || null,
    data.Vehicle_Inspection_Date || null,
    data.Inspection_Due_Date || null,
    data.Remarks || null,
    data.AgreementNumber || null,
    createdBy
  ];

  const result = await query(sql, params);
  return result.insertId;
};

/**
 * Update an existing transport record
 */
export const saveTransport = async (transportId, data, updatedBy) => {
  const sql = `
    UPDATE eng_transport_master 
    SET 
      Vehicle_Name = ?,
      Vehicle_Company = ?,
      Vehicle_Model = ?,
      Vehicle_Type = ?,
      Vehicle_Number = ?,
      COE_Regn_Number = ?,
      COE_Issue_Date = ?,
      COE_Expiry_Date = ?,
      RoadTax_Regn_Number = ?,
      RoadTax_Iussue_Date = ?,
      RoadTax_Expiry_Date = ?,
      Insurance_Policy_Number = ?,
      Insurance_Issue_Date = ?,
      Insurance_Expiry_Date = ?,
      Insurance_Company = ?,
      Last_Insurance_Renew_Date = ?,
      Vehicle_Inspection_Date = ?,
      Inspection_Due_Date = ?,
      Remarks = ?,
      AgreementNumber = ?,
      UpdatedDate = NOW(),
      UpdatedBy = ?
    WHERE TransportID = ?
  `;

  const params = [
    data.Vehicle_Name || null,
    data.Vehicle_Company || null,
    data.Vehicle_Model || null,
    data.Vehicle_Type || null,
    data.Vehicle_Number || null,
    data.COE_Regn_Number || null,
    data.COE_Issue_Date || null,
    data.COE_Expiry_Date || null,
    data.RoadTax_Regn_Number || null,
    data.RoadTax_Issue_Date || null, // maps to RoadTax_Iussue_Date in DB
    data.RoadTax_Expiry_Date || null,
    data.Insurance_Policy_Number || null,
    data.Insurance_Issue_Date || null,
    data.Insurance_Expiry_Date || null,
    data.Insurance_Company || null,
    data.Last_Insurance_Renew_Date || null,
    data.Vehicle_Inspection_Date || null,
    data.Inspection_Due_Date || null,
    data.Remarks || null,
    data.AgreementNumber || null,
    updatedBy,
    transportId
  ];

  await query(sql, params);
  return true;
};

/**
 * Soft delete a transport record
 */
export const deleteTransport = async (transportId, updatedBy) => {
  const sql = `
    UPDATE eng_transport_master 
    SET IsActive = 0, UpdatedBy = ?, UpdatedDate = NOW()
    WHERE TransportID = ?
  `;
  return await query(sql, [updatedBy, transportId]);
};
