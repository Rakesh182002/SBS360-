import mysql from 'mysql2/promise';
import logger from '../utils/Logger.js';
import Configuration from "../environment/Configuration.json" with { type: "json" };

export const env = process.env.NODE_ENV ?? "development";
const configuration = Configuration[env];


const dbconfig = {
  host: configuration.DB_HOST,
  port: configuration.DB_PORT ?? 3306,
  user: configuration.DB_USER,
  password: configuration.DB_PASS,
  database: configuration.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
};

const pool = mysql.createPool(dbconfig);

// Test connection
pool.getConnection()
  .then(connection => {
    logger.info('MySQL Database Connected Successfully.');
    connection.release();
  })
  .catch(err => {
    logger.error('Database connection failed:', err.message);
  });

export default pool;