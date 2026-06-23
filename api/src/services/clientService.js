import * as clientDao from '../Dao/clientDao.js';

/**
 * Get all active clients
 */
export const getAllClients = async () => {
  return await clientDao.getAllClients();
};

/**
 * Retrieve specific client details (includes address and contacts)
 */
export const getClient = async (clientId) => {
  const client = await clientDao.getClientById(clientId);
  if (!client) {
    throw { statusCode: 404, message: 'Client not found.' };
  }
  return client;
};

/**
 * Handle new client registration within a transaction
 */
export const createClient = async (clientData, addressData, contactsList, createdBy) => {
  if (!clientData.Company_Name) {
    throw { statusCode: 400, message: 'Company Name is required.' };
  }
  return await clientDao.createClientTransaction(clientData, addressData, contactsList, createdBy);
};

/**
 * Handle client edits, address updates, and contact syncing
 */
export const updateClient = async (clientId, clientData, addressData, contactsList, deletedContacts, updatedBy) => {
  const client = await clientDao.getClientById(clientId);
  if (!client) {
    throw { statusCode: 404, message: 'Client not found.' };
  }
  return await clientDao.saveClientTransaction(clientId, clientData, addressData, contactsList, deletedContacts, updatedBy);
};

/**
 * Perform soft-delete on client record
 */
export const deleteClient = async (clientId, updatedBy) => {
  const client = await clientDao.getClientById(clientId);
  if (!client) {
    throw { statusCode: 404, message: 'Client not found.' };
  }
  await clientDao.deleteClient(clientId, updatedBy);
  return true;
};

/**
 * Get functionalities list
 */
export const getAllFunctions = async () => {
  return await clientDao.getAllFunctions();
};

/**
 * Get industries list
 */
export const getAllIndustries = async () => {
  return await clientDao.getAllIndustries();
};

/**
 * Get details of a single contact
 */
export const getContact = async (ccid) => {
  const contact = await clientDao.getContactById(ccid);
  if (!contact) {
    throw { statusCode: 404, message: 'Contact not found.' };
  }
  return contact;
};
