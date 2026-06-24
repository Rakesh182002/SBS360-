import { query } from '../models/dbModel.js';
import db from '../config/db.js';

/**
 * Get all active suppliers joined with address details and industry title
 */
export const getAllSuppliers = async () => {
  const sql = `
    SELECT s.*, 
           a.Email, a.Mobile, a.Tel, a.Web, a.Address1, a.Address2, a.City, a.Country, a.Postal_Code, a.Fax1, a.Remarks as AddressRemarks,
           i.Industry_Title
    FROM eng_supplier_master s
    LEFT JOIN eng_address_master a ON s.AddressID = a.AddressID
    LEFT JOIN eng_sys_industry i ON s.IndustryID = i.Id
    WHERE s.IsActive = 1
  `;
  return await query(sql);
};

/**
 * Get a specific supplier profile by ID joined with address details
 */
export const getSupplierById = async (supplierId) => {
  const sql = `
    SELECT s.*, 
           a.Email, a.Mobile, a.Tel, a.Web, a.Address1, a.Address2, a.City, a.Country, a.Postal_Code, a.Fax1, a.Remarks as AddressRemarks
    FROM eng_supplier_master s
    LEFT JOIN eng_address_master a ON s.AddressID = a.AddressID
    WHERE s.SupplierID = ? AND s.IsActive = 1
  `;
  const suppliers = await query(sql, [supplierId]);
  return suppliers.length > 0 ? suppliers[0] : null;
};

/**
 * Create a new supplier and address within a transaction
 */
export const createSupplierTransaction = async (supplierData, addressData, createdBy) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Generate unique SupplierDisplayID (SPRXXXXX)
    let supplierDisplayId = supplierData.SupplierDisplayID;
    if (!supplierDisplayId) {
      const [rows] = await connection.execute(
        `SELECT SupplierDisplayID FROM eng_supplier_master 
         WHERE SupplierDisplayID LIKE 'SPR%' 
         ORDER BY SupplierDisplayID DESC LIMIT 1`
      );

      let nextNum = 1;
      if (rows && rows.length > 0) {
        const lastId = rows[0].SupplierDisplayID;
        const match = lastId.match(/^SPR(\d+)$/);
        if (match) {
          nextNum = parseInt(match[1], 10) + 1;
        }
      }
      supplierDisplayId = `SPR${String(nextNum).padStart(5, '0')}`;
    }

    // 2. Insert into eng_address_master
    const [addressResult] = await connection.execute(
      `INSERT INTO eng_address_master (Email, Mobile, Tel, Web, Address1, Address2, City, Country, Postal_Code, Fax1)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        addressData.Email || null,
        addressData.Mobile || null,
        addressData.Tel || null,
        addressData.Web || null,
        addressData.Address1 || null,
        addressData.Address2 || null,
        addressData.City || null,
        addressData.Country || null,
        addressData.Postal_Code || null,
        addressData.Fax1 || null
      ]
    );
    const addressId = addressResult.insertId;

    // 3. Insert into eng_supplier_master
    const [supplierResult] = await connection.execute(
      `INSERT INTO eng_supplier_master (SupplierDisplayID, Company_Name, IndustryID, Spoc_Name, Supplier_Description, AddressID, CreatedDate, CreatedBy, IsActive)
       VALUES (?, ?, ?, ?, ?, ?, NOW(), ?, 1)`,
      [
        supplierDisplayId,
        supplierData.Company_Name,
        supplierData.IndustryID || null,
        supplierData.Spoc_Name || null,
        supplierData.Supplier_Description || null,
        addressId,
        createdBy
      ]
    );
    const supplierId = supplierResult.insertId;

    await connection.commit();
    return supplierId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Update an existing supplier and address within a transaction
 */
export const saveSupplierTransaction = async (supplierId, supplierData, addressData, updatedBy) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Update eng_supplier_master
    await connection.execute(
      `UPDATE eng_supplier_master 
       SET Company_Name = ?, IndustryID = ?, Spoc_Name = ?, Supplier_Description = ?, UpdatedDate = NOW(), UpdatedBy = ?
       WHERE SupplierID = ?`,
      [
        supplierData.Company_Name,
        supplierData.IndustryID || null,
        supplierData.Spoc_Name || null,
        supplierData.Supplier_Description || null,
        updatedBy,
        supplierId
      ]
    );

    // 2. Fetch current supplier to retrieve AddressID
    const [supplierRows] = await connection.execute(
      `SELECT AddressID FROM eng_supplier_master WHERE SupplierID = ?`,
      [supplierId]
    );

    if (supplierRows.length > 0 && supplierRows[0].AddressID) {
      const addressId = supplierRows[0].AddressID;
      // Update eng_address_master
      await connection.execute(
        `UPDATE eng_address_master 
         SET Email = ?, Mobile = ?, Tel = ?, Web = ?, Address1 = ?, Address2 = ?, City = ?, Country = ?, Postal_Code = ?, Fax1 = ?
         WHERE AddressID = ?`,
        [
          addressData.Email || null,
          addressData.Mobile || null,
          addressData.Tel || null,
          addressData.Web || null,
          addressData.Address1 || null,
          addressData.Address2 || null,
          addressData.City || null,
          addressData.Country || null,
          addressData.Postal_Code || null,
          addressData.Fax1 || null,
          addressId
        ]
      );
    }

    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Soft delete a supplier by setting IsActive = 0
 */
export const deleteSupplier = async (supplierId, updatedBy) => {
  const sql = `
    UPDATE eng_supplier_master 
    SET IsActive = 0, UpdatedBy = ?, UpdatedDate = NOW()
    WHERE SupplierID = ?
  `;
  return await query(sql, [updatedBy, supplierId]);
};

/**
 * Fetch all industries for select menu options
 */
export const getAllIndustries = async () => {
  return await query(`SELECT Id as value, Industry_Title as label FROM eng_sys_industry`);
};
