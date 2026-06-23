import { query } from '../models/dbModel.js';
import db from '../config/db.js';

/**
 * Get all active clients from the database joined with their address and functions
 */
export const getAllClients = async () => {
  const sql = `
    SELECT c.*, 
           a.Email, a.Mobile, a.Tel, a.Web, a.Address1, a.Address2, a.City, a.Country, a.Postal_Code, a.Fax1, a.Remarks as AddressRemarks
    FROM eng_client_master c
    LEFT JOIN eng_address_master a ON c.AddressID = a.AddressID
    WHERE c.IsActive = 1
  `;
  return await query(sql);
};

/**
 * Retrieve client details, address, and sub-contacts by client ID
 */
export const getClientById = async (clientId) => {
  const clientSql = `
    SELECT c.*, 
           a.Email, a.Mobile, a.Tel, a.Web, a.Address1, a.Address2, a.City, a.Country, a.Postal_Code, a.Fax1, a.Remarks as AddressRemarks
    FROM eng_client_master c
    LEFT JOIN eng_address_master a ON c.AddressID = a.AddressID
    WHERE c.ClientID = ? AND c.IsActive = 1
  `;
  const clients = await query(clientSql, [clientId]);
  if (clients.length === 0) return null;

  const contactSql = `SELECT * FROM eng_client_contact WHERE ClientID = ?`;
  const contacts = await query(contactSql, [clientId]);
  
  return {
    ...clients[0],
    contacts
  };
};

/**
 * Perform transaction to create client address, client record, and client contacts
 */
export const createClientTransaction = async (clientData, addressData, contactsList, createdBy) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    let clientDisplayId = clientData.ClientDisplayID;
    if (!clientDisplayId) {
      // Find the last ClientDisplayID from database
      const [rows] = await connection.execute(
        `SELECT ClientDisplayID FROM eng_client_master 
         WHERE ClientDisplayID LIKE 'CLT%' 
         ORDER BY ClientDisplayID DESC LIMIT 1`
      );

      let nextNum = 1;
      if (rows && rows.length > 0) {
        const lastId = rows[0].ClientDisplayID;
        const match = lastId.match(/^CLT(\d+)$/);
        if (match) {
          nextNum = parseInt(match[1], 10) + 1;
        }
      }
      clientDisplayId = `CLT${String(nextNum).padStart(5, '0')}`;
    }

    // 1. Insert into eng_address_master
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

    // 2. Insert into eng_client_master
    const [clientResult] = await connection.execute(
      `INSERT INTO eng_client_master (ClientDisplayID, Company_Name, IndustryID, FunctionalityID, Reference, AddressID, CreatedDate, CreatedBy, IsActive)
       VALUES (?, ?, ?, ?, ?, ?, NOW(), ?, 1)`,
      [
        clientDisplayId,
        clientData.Company_Name,
        clientData.IndustryID || null,
        clientData.FunctionalityID || null,
        clientData.Reference || null,
        addressId,
        createdBy
      ]
    );
    const clientId = clientResult.insertId;

    // 3. Insert client contacts
    if (contactsList && contactsList.length > 0) {
      for (const contact of contactsList) {
        await connection.execute(
          `INSERT INTO eng_client_contact (ClientID, NamePrefix, SPOCName, Email, Mobile, Tel, Remarks)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            clientId,
            contact.NamePrefix || null,
            contact.SPOCName || null,
            contact.Email || null,
            contact.Mobile || null,
            contact.Tel || null,
            contact.Remarks || null
          ]
        );
      }
    }

    await connection.commit();
    return clientId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Perform transaction to update client info, address, contacts, and delete requested contacts
 */
export const saveClientTransaction = async (clientId, clientData, addressData, contactsList, deletedContacts, updatedBy) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Update eng_client_master
    await connection.execute(
      `UPDATE eng_client_master 
       SET Company_Name = ?, IndustryID = ?, FunctionalityID = ?, Reference = ?, UpdatedDate = NOW(), UpdatedBy = ?
       WHERE ClientID = ?`,
      [
        clientData.Company_Name,
        clientData.IndustryID || null,
        clientData.FunctionalityID || null,
        clientData.Reference || null,
        updatedBy,
        clientId
      ]
    );

    // 2. Fetch current client to get AddressID
    const [clientRows] = await connection.execute(
      `SELECT AddressID FROM eng_client_master WHERE ClientID = ?`,
      [clientId]
    );
    if (clientRows.length > 0 && clientRows[0].AddressID) {
      const addressId = clientRows[0].AddressID;
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

    // 3. Delete requested contacts
    if (deletedContacts && deletedContacts.length > 0) {
      const placeholders = deletedContacts.map(() => '?').join(',');
      await connection.execute(
        `DELETE FROM eng_client_contact WHERE CCID IN (${placeholders}) AND ClientID = ?`,
        [...deletedContacts, clientId]
      );
    }

    // 4. Update or Insert contacts
    if (contactsList && contactsList.length > 0) {
      for (const contact of contactsList) {
        if (contact.CCID && contact.CCID > 0) {
          // Update
          await connection.execute(
            `UPDATE eng_client_contact 
             SET NamePrefix = ?, SPOCName = ?, Email = ?, Mobile = ?, Tel = ?, Remarks = ?
             WHERE CCID = ? AND ClientID = ?`,
            [
              contact.NamePrefix || null,
              contact.SPOCName || null,
              contact.Email || null,
              contact.Mobile || null,
              contact.Tel || null,
              contact.Remarks || null,
              contact.CCID,
              clientId
            ]
          );
        } else {
          // Insert
          await connection.execute(
            `INSERT INTO eng_client_contact (ClientID, NamePrefix, SPOCName, Email, Mobile, Tel, Remarks)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              clientId,
              contact.NamePrefix || null,
              contact.SPOCName || null,
              contact.Email || null,
              contact.Mobile || null,
              contact.Tel || null,
              contact.Remarks || null
            ]
          );
        }
      }
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
 * Soft delete a client by setting IsActive = 0
 */
export const deleteClient = async (clientId, updatedBy) => {
  const sql = `
    UPDATE eng_client_master 
    SET IsActive = 0, UpdatedBy = ?, UpdatedDate = NOW()
    WHERE ClientID = ?
  `;
  return await query(sql, [updatedBy, clientId]);
};

/**
 * Fetch all functionalities for select menu options
 */
export const getAllFunctions = async () => {
  return await query(`SELECT Id as value, Fn_Title as label FROM eng_sys_function`);
};

/**
 * Fetch all industries for select menu options
 */
export const getAllIndustries = async () => {
  return await query(`SELECT Id as value, Industry_Title as label FROM eng_sys_industry`);
};

/**
 * Fetch a single contact detail by CCID
 */
export const getContactById = async (ccid) => {
  const rows = await query(`SELECT * FROM eng_client_contact WHERE CCID = ?`, [ccid]);
  return rows.length > 0 ? rows[0] : null;
};
