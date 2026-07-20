import { Router } from 'express';
import mongoose from 'mongoose';

const router = Router();

router.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = dbState === 1 ? 'connected' : 'disconnected';
  const statusCode = dbState === 1 ? 200 : 503;

  res.status(statusCode).json({
    status: dbState === 1 ? 'ok' : 'error',
    db: dbStatus,
  });
});

export default router;
