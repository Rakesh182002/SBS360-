import { query } from '../models/dbModel.js';
import db from '../config/db.js';

/**
 * Get all active employees with addresses and group names
 */
export const getAllEmployees = async () => {
  const sql = `
    SELECT emp.*, 
           addr.Email, addr.Mobile, addr.Tel, addr.Web, addr.Address1, addr.Address2, addr.City, addr.Country, addr.Postal_Code, addr.Fax1, addr.SkypeID, addr.Remarks as AddressRemarks,
           g.GroupName,
           u.UserName
    FROM eng_employee_profile emp
    LEFT JOIN eng_address_master addr ON emp.AddressID = addr.AddressID
    LEFT JOIN eng_usergroup g ON emp.GroupID = g.GroupID
    LEFT JOIN eng_users u ON u.EmpID = emp.UserID
    WHERE emp.IsActive = 1
    ORDER BY emp.FirstName
  `;
  return await query(sql);
};

/**
 * Retrieve detailed employee profile by ID
 */
export const getEmployeeById = async (employeeId) => {
  const sql = `
    SELECT emp.*, 
           addr.Email, addr.Mobile, addr.Tel, addr.Web, addr.Address1, addr.Address2, addr.City, addr.Country, addr.Postal_Code, addr.Fax1, addr.SkypeID, addr.Remarks as AddressRemarks,
           g.GroupName,
           u.UserName
    FROM eng_employee_profile emp
    LEFT JOIN eng_address_master addr ON emp.AddressID = addr.AddressID
    LEFT JOIN eng_usergroup g ON emp.GroupID = g.GroupID
    LEFT JOIN eng_users u ON u.EmpID = emp.UserID
    WHERE emp.UserID = ? AND emp.IsActive = 1
  `;
  const rows = await query(sql, [employeeId]);
  return rows.length > 0 ? rows[0] : null;
};

/**
 * Get filtered employees based on UserID, OpBranch, dateFrom, and dateTo
 */
export const getFilterEmployees = async (filter) => {
  let sql = `
    SELECT emp.*, 
           addr.Email, addr.Mobile, addr.Tel, addr.Web, addr.Address1, addr.Address2, addr.City, addr.Country, addr.Postal_Code, addr.Fax1, addr.SkypeID, addr.Remarks as AddressRemarks,
           g.GroupName,
           u.UserName
    FROM eng_employee_profile emp
    LEFT JOIN eng_address_master addr ON emp.AddressID = addr.AddressID
    LEFT JOIN eng_usergroup g ON emp.GroupID = g.GroupID
    LEFT JOIN eng_users u ON u.EmpID = emp.UserID
    WHERE emp.IsActive = 1
  `;
  
  const params = [];

  if (filter.UserID && parseInt(filter.UserID, 10) > 0) {
    sql += ` AND emp.UserID = ?`;
    params.push(parseInt(filter.UserID, 10));
  }

  if (filter.dateFrom) {
    sql += ` AND emp.DoJ >= ?`;
    params.push(filter.dateFrom); // Date should be in YYYY-MM-DD
  }

  if (filter.dateTo) {
    sql += ` AND emp.DoJ <= ?`;
    params.push(filter.dateTo); // Date should be in YYYY-MM-DD
  }

  if (filter.OpBranch && filter.OpBranch !== 'Select') {
    sql += ` AND emp.OpBranch = ?`;
    params.push(filter.OpBranch);
  }

  sql += ` ORDER BY emp.FirstName`;

  return await query(sql, params);
};

/**
 * Get list of all user groups
 */
export const getUsergroups = async () => {
  return await query(`SELECT GroupID, GroupName FROM eng_usergroup WHERE GroupID != 1 ORDER BY GroupName`);
};

/**
 * Get list of all addresses
 */
export const getAddresses = async () => {
  return await query(`SELECT AddressID, Email, Mobile, Tel, Address1, Address2, City, Country FROM eng_address_master`);
};

/**
 * Create employee record in a database transaction
 */
export const createEmployeeTransaction = async (employeeData, addressData, userData, createdBy) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Insert into eng_address_master
    const [addressResult] = await connection.execute(
      `INSERT INTO eng_address_master (Email, Mobile, Tel, Web, Address1, Address2, City, Country, Postal_Code, Fax1, SkypeID, Remarks)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        addressData.SkypeID || null,
        addressData.Remarks || null
      ]
    );
    const addressId = addressResult.insertId;

    // 2. Insert into eng_employee_profile
    const [employeeResult] = await connection.execute(
      `INSERT INTO eng_employee_profile (
         EmpID, OpBranch, FirstName, LastName, AddressID, Nationality, DoB, 
         SOC_number, SOC_Issue_Date, SOC_Expiry_Date, Salary, Levy, DoJ, DoR, 
         Gender, Designation, ID_Type, ID_Number, Profile_Desc, Profile_Photo_Path, 
         llevel, CreatedDate, CreatedBy, Passport_Number, Passport_Valid_Till, 
         Permit_Number, Permit_Valid_From, Permit_Valid_To, Licence_Number, Licence_Valid_Till, 
         Insurance_Number, Insurance_Valid_Till, IsActive, License_Scissor_Lift_Number, 
         License_Scissor_Lift_ExpiryDate, License_Boom_Lift_Number, License_Boom_Lift_ExpiryDate, 
         License_WorkatHeight_Number, License_WorkatHeight_ExpiryDate, License_IslandPass_Number, 
         License_IslandPass_ExpiryDate, Skilled_Level, Safety_Supervisor_Name, License_Course, 
         License_Course_Expiry_Date, GroupID
       ) VALUES (
         ?, ?, ?, ?, ?, ?, ?, 
         ?, ?, ?, ?, ?, ?, ?, 
         ?, ?, ?, ?, ?, ?, 
         ?, NOW(), ?, ?, ?, 
         ?, ?, ?, ?, ?, 
         ?, ?, 1, ?, 
         ?, ?, ?, 
         ?, ?, ?, 
         ?, ?, ?, ?, 
         ?, ?
       )`,
      [
        employeeData.EmpID || null,
        employeeData.OpBranch || null,
        employeeData.FirstName || null,
        employeeData.LastName || null,
        addressId,
        employeeData.Nationality || null,
        employeeData.DoB || null,
        employeeData.SOC_number || null,
        employeeData.SOC_Issue_Date || null,
        employeeData.SOC_Expiry_Date || null,
        employeeData.Salary || null,
        employeeData.Levy || null,
        employeeData.DoJ || null,
        employeeData.DoR || null,
        employeeData.Gender || null,
        employeeData.Designation || null,
        employeeData.ID_Type || null,
        employeeData.ID_Number || null,
        employeeData.Profile_Desc || null,
        employeeData.Profile_Photo_Path || null,
        employeeData.llevel || null,
        createdBy,
        employeeData.Passport_Number || null,
        employeeData.Passport_Valid_Till || null,
        employeeData.Permit_Number || null,
        employeeData.Permit_Valid_From || null,
        employeeData.Permit_Valid_To || null,
        employeeData.Licence_Number || null,
        employeeData.Licence_Valid_Till || null,
        employeeData.Insurance_Number || null,
        employeeData.Insurance_Valid_Till || null,
        employeeData.License_Scissor_Lift_Number || null,
        employeeData.License_Scissor_Lift_ExpiryDate || null,
        employeeData.License_Boom_Lift_Number || null,
        employeeData.License_Boom_Lift_ExpiryDate || null,
        employeeData.License_WorkatHeight_Number || null,
        employeeData.License_WorkatHeight_ExpiryDate || null,
        employeeData.License_IslandPass_Number || null,
        employeeData.License_IslandPass_ExpiryDate || null,
        employeeData.Skilled_Level || null,
        employeeData.Safety_Supervisor_Name || null,
        employeeData.License_Course || null,
        employeeData.License_Course_Expiry_Date || null,
        employeeData.GroupID || null
      ]
    );
    const employeeId = employeeResult.insertId;

    // 3. Create login account in eng_users if UserName is supplied
    if (userData && userData.UserName) {
      const displayName = `${employeeData.FirstName || ''} ${employeeData.LastName || ''}`.trim();
      await connection.execute(
        `INSERT INTO eng_users (UserName, Password, EmpID, GroupID, DisplayName, IsActive, CreatedBy, CreatedDate)
         VALUES (?, ?, ?, ?, ?, 1, ?, NOW())`,
        [
          userData.UserName,
          userData.Password || null,
          employeeId,
          employeeData.GroupID || null,
          displayName || userData.UserName,
          createdBy
        ]
      );
    }

    await connection.commit();
    return employeeId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Save / Update employee record within a database transaction
 */
export const saveEmployeeTransaction = async (employeeId, employeeData, addressData, userData, updatedBy) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Update eng_employee_profile
    await connection.execute(
      `UPDATE eng_employee_profile SET
         EmpID = ?, OpBranch = ?, FirstName = ?, LastName = ?, Nationality = ?, DoB = ?, 
         SOC_number = ?, SOC_Issue_Date = ?, SOC_Expiry_Date = ?, Salary = ?, Levy = ?, DoJ = ?, DoR = ?, 
         Gender = ?, Designation = ?, ID_Type = ?, ID_Number = ?, Profile_Desc = ?, Profile_Photo_Path = ?, 
         llevel = ?, UpdatedDate = NOW(), UpdatedBy = ?, Passport_Number = ?, Passport_Valid_Till = ?, 
         Permit_Number = ?, Permit_Valid_From = ?, Permit_Valid_To = ?, Licence_Number = ?, Licence_Valid_Till = ?, 
         Insurance_Number = ?, Insurance_Valid_Till = ?, License_Scissor_Lift_Number = ?, 
         License_Scissor_Lift_ExpiryDate = ?, License_Boom_Lift_Number = ?, License_Boom_Lift_ExpiryDate = ?, 
         License_WorkatHeight_Number = ?, License_WorkatHeight_ExpiryDate = ?, License_IslandPass_Number = ?, 
         License_IslandPass_ExpiryDate = ?, Skilled_Level = ?, Safety_Supervisor_Name = ?, License_Course = ?, 
         License_Course_Expiry_Date = ?, GroupID = ?
       WHERE UserID = ?`,
      [
        employeeData.EmpID || null,
        employeeData.OpBranch || null,
        employeeData.FirstName || null,
        employeeData.LastName || null,
        employeeData.Nationality || null,
        employeeData.DoB || null,
        employeeData.SOC_number || null,
        employeeData.SOC_Issue_Date || null,
        employeeData.SOC_Expiry_Date || null,
        employeeData.Salary || null,
        employeeData.Levy || null,
        employeeData.DoJ || null,
        employeeData.DoR || null,
        employeeData.Gender || null,
        employeeData.Designation || null,
        employeeData.ID_Type || null,
        employeeData.ID_Number || null,
        employeeData.Profile_Desc || null,
        employeeData.Profile_Photo_Path || null,
        employeeData.llevel || null,
        updatedBy,
        employeeData.Passport_Number || null,
        employeeData.Passport_Valid_Till || null,
        employeeData.Permit_Number || null,
        employeeData.Permit_Valid_From || null,
        employeeData.Permit_Valid_To || null,
        employeeData.Licence_Number || null,
        employeeData.Licence_Valid_Till || null,
        employeeData.Insurance_Number || null,
        employeeData.Insurance_Valid_Till || null,
        employeeData.License_Scissor_Lift_Number || null,
        employeeData.License_Scissor_Lift_ExpiryDate || null,
        employeeData.License_Boom_Lift_Number || null,
        employeeData.License_Boom_Lift_ExpiryDate || null,
        employeeData.License_WorkatHeight_Number || null,
        employeeData.License_WorkatHeight_ExpiryDate || null,
        employeeData.License_IslandPass_Number || null,
        employeeData.License_IslandPass_ExpiryDate || null,
        employeeData.Skilled_Level || null,
        employeeData.Safety_Supervisor_Name || null,
        employeeData.License_Course || null,
        employeeData.License_Course_Expiry_Date || null,
        employeeData.GroupID || null,
        employeeId
      ]
    );

    // 2. Fetch current employee to get AddressID
    const [empRows] = await connection.execute(
      `SELECT AddressID FROM eng_employee_profile WHERE UserID = ?`,
      [employeeId]
    );
    if (empRows.length > 0 && empRows[0].AddressID) {
      const addressId = empRows[0].AddressID;
      // Update eng_address_master
      await connection.execute(
        `UPDATE eng_address_master 
         SET Email = ?, Mobile = ?, Tel = ?, Web = ?, Address1 = ?, Address2 = ?, City = ?, Country = ?, Postal_Code = ?, Fax1 = ?, SkypeID = ?, Remarks = ?
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
          addressData.SkypeID || null,
          addressData.Remarks || null,
          addressId
        ]
      );
    }

    // 3. Update or Insert login account in eng_users
    if (userData && userData.UserName) {
      const [userRows] = await connection.execute(
        `SELECT UserID FROM eng_users WHERE EmpID = ?`,
        [employeeId]
      );

      const displayName = `${employeeData.FirstName || ''} ${employeeData.LastName || ''}`.trim();

      if (userRows.length > 0) {
        // Update user
        const userId = userRows[0].UserID;
        let updateSql = `UPDATE eng_users SET UserName = ?, GroupID = ?, DisplayName = ?, UpdatedBy = ?, UpdatedDate = NOW()`;
        const updateParams = [userData.UserName, employeeData.GroupID || null, displayName || userData.UserName, updatedBy];

        if (userData.Password) {
          updateSql = `UPDATE eng_users SET UserName = ?, Password = ?, GroupID = ?, DisplayName = ?, UpdatedBy = ?, UpdatedDate = NOW()`;
          updateParams.splice(1, 0, userData.Password);
        }

        updateSql += ` WHERE UserID = ?`;
        updateParams.push(userId);

        await connection.execute(updateSql, updateParams);
      } else {
        // Create user
        await connection.execute(
          `INSERT INTO eng_users (UserName, Password, EmpID, GroupID, DisplayName, IsActive, CreatedBy, CreatedDate)
           VALUES (?, ?, ?, ?, ?, 1, ?, NOW())`,
          [
            userData.UserName,
            userData.Password || null,
            employeeId,
            employeeData.GroupID || null,
            displayName || userData.UserName,
            updatedBy
          ]
        );
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
 * Soft delete employee and their linked login user
 */
export const deleteEmployee = async (employeeId, updatedBy) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Soft delete employee profile
    await connection.execute(
      `UPDATE eng_employee_profile SET IsActive = 0, UpdatedBy = ?, UpdatedDate = NOW() WHERE UserID = ?`,
      [updatedBy, employeeId]
    );

    // 2. Soft delete linked user record
    await connection.execute(
      `UPDATE eng_users SET IsActive = 0, UpdatedBy = ?, UpdatedDate = NOW() WHERE EmpID = ?`,
      [updatedBy, employeeId]
    );

    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
