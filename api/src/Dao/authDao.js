import { query } from '../models/dbModel.js';

/**
 * Get user full profile details for login and token payload
 */
export const getUserFullProfile = async (username, userId = null) => {
  let queryStr = `
    SELECT u.UserID as id, u.UserName as username, u.Password as password, u.DisplayName as displayName, u.IsActive as isActive, u.LastLogin as lastLogin,
           g.GroupName as role_name, g.GroupID as role_id,
           emp.FirstName as emp_first_name, emp.LastName as emp_last_name,
           addr.Email as address_email
    FROM eng_users u
    LEFT JOIN eng_usergroup g ON u.GroupID = g.GroupID
    LEFT JOIN eng_employee_profile emp ON u.EmpID = emp.UserID
    LEFT JOIN eng_address_master addr ON emp.AddressID = addr.AddressID
  `;
  
  const params = [];
  if (userId) {
    queryStr += ` WHERE u.UserID = ?`;
    params.push(userId);
  } else {
    queryStr += ` WHERE u.UserName = ?`;
    params.push(username);
  }

  const rows = await query(queryStr, params);
  return rows.length > 0 ? rows[0] : null;
};

/**
 * Get permissions assigned to a role group
 */
export const getRolePermissions = async (groupId) => {
  return await query(
    `SELECT m.ModuleName FROM eng_permission p
     JOIN eng_module m ON p.ModuleID = m.ModuleID
     WHERE p.GroupID = ? AND p.Access = 1`,
    [groupId]
  );
};

/**
 * Update LastLogin timestamp for a user
 */
export const updateLastLogin = async (userId) => {
  return await query(`UPDATE eng_users SET LastLogin = NOW() WHERE UserID = ?`, [userId]);
};

/**
 * Update user password
 */
export const updatePassword = async (userId, hashedPassword) => {
  return await query(`UPDATE eng_users SET Password = ? WHERE UserID = ?`, [hashedPassword, userId]);
};

/**
 * Find user by username
 */
export const findUserByUsername = async (username) => {
  const rows = await query(`SELECT UserID FROM eng_users WHERE UserName = ?`, [username]);
  return rows.length > 0 ? rows[0] : null;
};
