import * as employeeService from '../services/employeeService.js';

/**
 * Get list of all employees
 */
export const getEmployees = async (req, res, next) => {
  try {
    const result = await employeeService.getAllEmployees();
    return res.status(200).json({
      success: true,
      message: 'Employees retrieved successfully.',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get employee details by ID
 */
export const getEmployeeDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await employeeService.getEmployee(parseInt(id, 10));
    return res.status(200).json({
      success: true,
      message: 'Employee details retrieved successfully.',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get filtered employees list
 */
export const getFilterEmployees = async (req, res, next) => {
  try {
    const { UserID, dateFrom, dateTo, OpBranch } = req.body;
    const filter = { UserID, dateFrom, dateTo, OpBranch };
    const result = await employeeService.getFilterEmployees(filter);
    return res.status(200).json({
      success: true,
      message: 'Filtered employees retrieved successfully.',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new employee and optional linked user account
 */
export const createEmployee = async (req, res, next) => {
  try {
    const { address, UserName, Password, ...employeeData } = req.body;
    const userId = req.user.id; // Active logged-in user

    const addressData = address || {};
    const userData = UserName ? { UserName, Password } : null;

    const newEmpId = await employeeService.createEmployee(employeeData, addressData, userData, userId);

    return res.status(201).json({
      success: true,
      message: 'Employee registered successfully.',
      data: { employeeId: newEmpId }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing employee profile and linked user account
 */
export const updateEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { address, UserName, Password, ...employeeData } = req.body;
    const userId = req.user.id;

    const addressData = address || {};
    const userData = UserName ? { UserName, Password } : null;

    await employeeService.updateEmployee(parseInt(id, 10), employeeData, addressData, userData, userId);

    return res.status(200).json({
      success: true,
      message: 'Employee details updated successfully.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete employee by ID
 */
export const deleteEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await employeeService.deleteEmployee(parseInt(id, 10), userId);

    return res.status(200).json({
      success: true,
      message: 'Employee deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all user groups for selection
 */
export const getUserGroups = async (req, res, next) => {
  try {
    const result = await employeeService.getUsergroups();
    return res.status(200).json({
      success: true,
      message: 'User groups retrieved successfully.',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all addresses list
 */
export const getAddresses = async (req, res, next) => {
  try {
    const result = await employeeService.getAddresses();
    return res.status(200).json({
      success: true,
      message: 'Addresses retrieved successfully.',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get simple list of employee names as strings (for MVC compatibility list)
 */
export const getAllEmployeeNames = async (req, res, next) => {
  try {
    const employees = await employeeService.getAllEmployees();
    const names = employees.map(e => `${e.FirstName || ''} ${e.LastName || ''}`.trim());
    return res.status(200).json(names);
  } catch (error) {
    next(error);
  }
};
