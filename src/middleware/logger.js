const logger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    console.log(`[${req.method} ${req.originalUrl} ${status} ${duration}ms]`);
  });

  next();
};

export default logger;
