// Unified Error Handling Middleware
const errorMiddleware = (err, req, res, next) => {
  console.error('[Error Details]:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message,
    errors: err.errors || null,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

export default errorMiddleware;
