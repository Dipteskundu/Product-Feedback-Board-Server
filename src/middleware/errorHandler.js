const errorHandler = (err, req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const errorName = err.name || 'InternalError';

  if (statusCode === 500) {
    console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, err.message);
  }

  res.status(statusCode).json({
    error: errorName,
    message: err.message || 'Internal server error',
  });
};

export default errorHandler;
