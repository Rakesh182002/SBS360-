import bcrypt from 'bcryptjs';
import * as employeeDao from '../Dao/employeeDao.js';

/**
 * Format date string from dd/MM/yyyy to YYYY-MM-DD for MySQL storage
 */
const formatDateToDB = (dateStr) => {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const trimmed = dateStr.trim();
  if (!trimmed) return null;

  // If already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }

  // Parse dd/MM/yyyy
  const parts = trimmed.split('/');
  if (parts.length === 3) {
    const day = parts[0].padStart(2, '0');
    const month = parts[1].padStart(2, '0');
    const year = parts[2];
    return `${year}-${month}-${day}`;
  }

  // Return standard parsed ISO date substring if it's full ISO format
  try {
    const d = new Date(trimmed);
    if (!isNaN(d.getTime())) {
      return d.toISOString().split('T')[0];
    }
  } catch (err) {}

  return trimmed;
};

/**
 * Format date fields inside employee object
 */
const formatEmployeeDates = (empData) => {
  const dateFields = [
    'DoB', 'DoJ', 'DoR', 'Passport_Valid_Till', 'Permit_Valid_From', 'Permit_Valid_To', 
    'Licence_Valid_Till', 'Insurance_Valid_Till', 'SOC_Issue_Date', 'SOC_Expiry_Date', 
    'License_Scissor_Lift_ExpiryDate', 'License_Boom_Lift_ExpiryDate', 
    'License_WorkatHeight_ExpiryDate', 'License_IslandPass_ExpiryDate', 'License_Course_Expiry_Date'
  ];
  
  const formatted = { ...empData };
  for (const field of dateFields) {
    if (formatted[field] !== undefined) {
      formatted[field] = formatDateToDB(formatted[field]);
    }
  }
  return formatted;
};

/**
 * Format date fields back to dd/MM/yyyy for frontend consumption
 */
const formatDateToUI = (dateObj) => {
  if (!dateObj) return '';
  try {
    const d = new Date(dateObj);
    if (isNaN(d.getTime())) return '';
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch (err) {
    return '';
  }
};

/**
 * Map date properties in retrieved employee object back to UI format
 */
const formatEmployeeForUI = (emp) => {
  if (!emp) return null;
  const dateFields = [
    'DoB', 'DoJ', 'DoR', 'Passport_Valid_Till', 'Permit_Valid_From', 'Permit_Valid_To', 
    'Licence_Valid_Till', 'Insurance_Valid_Till', 'SOC_Issue_Date', 'SOC_Expiry_Date', 
    'License_Scissor_Lift_ExpiryDate', 'License_Boom_Lift_ExpiryDate', 
    'License_WorkatHeight_ExpiryDate', 'License_IslandPass_ExpiryDate', 'License_Course_Expiry_Date'
  ];
  
  const formatted = { ...emp };
  for (const field of dateFields) {
    if (formatted[field]) {
      formatted[field] = formatDateToUI(formatted[field]);
    }
  }
  return formatted;
};

/**
 * Get all active employees
 */
export const getAllEmployees = async () => {
  const employees = await employeeDao.getAllEmployees();
  return employees.map(emp => formatEmployeeForUI(emp));
};

/**
 * Get detailed employee profile by ID
 */
export const getEmployee = async (employeeId) => {
  const employee = await employeeDao.getEmployeeById(employeeId);
  if (!employee) {
    throw { statusCode: 404, message: 'Employee not found.' };
  }
  return formatEmployeeForUI(employee);
};

/**
 * Get filtered employees
 */
export const getFilterEmployees = async (filter) => {
  const parsedFilter = { ...filter };
  if (parsedFilter.dateFrom) parsedFilter.dateFrom = formatDateToDB(parsedFilter.dateFrom);
  if (parsedFilter.dateTo) parsedFilter.dateTo = formatDateToDB(parsedFilter.dateTo);

  const employees = await employeeDao.getFilterEmployees(parsedFilter);
  return employees.map(emp => formatEmployeeForUI(emp));
};

/**
 * Create new employee profile and optional login user
 */
export const createEmployee = async (employeeData, addressData, userData, createdBy) => {
  const formattedEmployee = formatEmployeeDates(employeeData);
  const formattedAddress = addressData || {};
  const formattedUser = userData || {};

  // Check if username is already taken
  if (formattedUser.UserName) {
    const existing = await employeeDao.getUsergroups(); // Simple lookup for users can be done, but let's query db
    const [existingUser] = await query(
      `SELECT UserID FROM eng_users WHERE UserName = ? AND IsActive = 1`,
      [formattedUser.UserName]
    );
    if (existingUser) {
      throw { statusCode: 400, message: 'Username is already taken.' };
    }

    // Hash the password
    if (formattedUser.Password) {
      const salt = await bcrypt.genSalt(10);
      formattedUser.Password = await bcrypt.hash(formattedUser.Password, salt);
    }
  }

  return await employeeDao.createEmployeeTransaction(formattedEmployee, formattedAddress, formattedUser, createdBy);
};

// Helper internal query logic for username conflict checks
import { query } from '../models/dbModel.js';

/**
 * Update existing employee profile, address details, and linked login user
 */
export const updateEmployee = async (employeeId, employeeData, addressData, userData, updatedBy) => {
  const existing = await employeeDao.getEmployeeById(employeeId);
  if (!existing) {
    throw { statusCode: 404, message: 'Employee not found.' };
  }

  const formattedEmployee = formatEmployeeDates(employeeData);
  const formattedAddress = addressData || {};
  const formattedUser = userData || {};

  if (formattedUser.UserName) {
    // Check if userName is taken by another user
    const [conflictUser] = await query(
      `SELECT UserID FROM eng_users WHERE UserName = ? AND EmpID != ? AND IsActive = 1`,
      [formattedUser.UserName, employeeId]
    );
    if (conflictUser) {
      throw { statusCode: 400, message: 'Username is already taken.' };
    }

    // Hash the password if a new one was provided
    if (formattedUser.Password) {
      const salt = await bcrypt.genSalt(10);
      formattedUser.Password = await bcrypt.hash(formattedUser.Password, salt);
    }
  }

  return await employeeDao.saveEmployeeTransaction(employeeId, formattedEmployee, formattedAddress, formattedUser, updatedBy);
};

/**
 * Soft delete an employee profile
 */
export const deleteEmployee = async (employeeId, updatedBy) => {
  const existing = await employeeDao.getEmployeeById(employeeId);
  if (!existing) {
    throw { statusCode: 404, message: 'Employee not found.' };
  }
  return await employeeDao.deleteEmployee(employeeId, updatedBy);
};

/**
 * Get user groups for dropdowns
 */
export const getUsergroups = async () => {
  return await employeeDao.getUsergroups();
};

/**
 * Get addresses
 */
export const getAddresses = async () => {
  return await employeeDao.getAddresses();
};
