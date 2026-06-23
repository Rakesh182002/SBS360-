import * as clientService from '../services/clientService.js';

/**
 * Get list of all clients
 */
export const getClients = async (req, res, next) => {
  try {
    const result = await clientService.getAllClients();
    return res.status(200).json({
      success: true,
      message: 'Clients retrieved successfully.',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get client details by ID
 */
export const getClientDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await clientService.getClient(parseInt(id, 10));
    return res.status(200).json({
      success: true,
      message: 'Client details retrieved successfully.',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Register a new client
 */
export const createClient = async (req, res, next) => {
  try {
    const { Company_Name, IndustryID, FunctionalityID, Reference, address, contacts } = req.body;
    const userId = req.user.id;

    const clientData = { Company_Name, IndustryID, FunctionalityID, Reference };
    const addressData = address || {};
    const contactsList = contacts || [];

    const clientId = await clientService.createClient(clientData, addressData, contactsList, userId);

    return res.status(201).json({
      success: true,
      message: 'Client created successfully.',
      data: { clientId }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing client
 */
export const updateClient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { Company_Name, IndustryID, FunctionalityID, Reference, address, contacts, deleted } = req.body;
    const userId = req.user.id;

    const clientId = parseInt(id, 10);
    const clientData = { Company_Name, IndustryID, FunctionalityID, Reference };
    const addressData = address || {};
    const contactsList = contacts || [];
    const deletedContacts = deleted || [];

    await clientService.updateClient(clientId, clientData, addressData, contactsList, deletedContacts, userId);

    return res.status(200).json({
      success: true,
      message: 'Client updated successfully.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete client by ID
 */
export const deleteClient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await clientService.deleteClient(parseInt(id, 10), userId);

    return res.status(200).json({
      success: true,
      message: 'Client deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get client functionalities
 */
export const getFunctions = async (req, res, next) => {
  try {
    const result = await clientService.getAllFunctions();
    return res.status(200).json({
      success: true,
      message: 'Client functionalities retrieved successfully.',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get client industries
 */
export const getIndustries = async (req, res, next) => {
  try {
    const result = await clientService.getAllIndustries();
    return res.status(200).json({
      success: true,
      message: 'Client industries retrieved successfully.',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single client contact detail
 */
export const getContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await clientService.getContact(parseInt(id, 10));
    return res.status(200).json({
      success: true,
      message: 'Contact retrieved successfully.',
      data: result
    });
  } catch (error) {
    next(error);
  }
};
