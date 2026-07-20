import rateLimit from 'express-rate-limit';

export const feedbackLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  keyGenerator: (req) => req.actorId || req.ip,
  validate: { keyGeneratorIpFallback: false },
  message: { error: 'TooManyRequests', message: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const voteLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  keyGenerator: (req) => req.actorId || req.ip,
  validate: { keyGeneratorIpFallback: false },
  message: { error: 'TooManyRequests', message: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});
