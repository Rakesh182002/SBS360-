import db from '../config/db.js';

/**
 * Execute a parameterized SQL query
 * @param {string} sql 
 * @param {Array} params 
 * @returns {Promise<any>}
 */
export const query = async (sql, params = []) => {
  try {
    const [results] = await db.execute(sql, params);
    return results;
  } catch (error) {
    console.error(`Database Query Error: ${sql}`, error);
    throw error;
  }
};

/**
 * Execute a query that returns a single row or null
 * @param {string} sql 
 * @param {Array} params 
 * @returns {Promise<any | null>}
 */
export const queryOne = async (sql, params = []) => {
  const results = await query(sql, params);
  return results.length > 0 ? results[0] : null;
};

