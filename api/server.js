import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import router from './src/routers/index.js';
import errorMiddleware from './src/middleware/errorMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Basic Security Middlewares
app.use(helmet());

// Configure CORS for local development UI access
app.use(cors({
  origin: '*', // Allow all origins for dev simplicity. Can be configured to specific domains.
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. Parsers & Logger
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. API Routes Mapping
app.use(router);

// 4. Root & Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'SBS 360 REST API is up and running.',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

// 5. Global Error Middleware (Must be registered last)
app.use(errorMiddleware);

// 6. Start Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Smart 360 Server running on port ${PORT}`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`💻 Base URL: http://localhost:${PORT}/api/v1`);
  console.log(`====================================================`);
});
