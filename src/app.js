import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import env from './config/env.js';
import logger from './middleware/logger.js';
import errorHandler from './middleware/errorHandler.js';
import routes from './routes/index.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(compression());
app.use(cookieParser(env.COOKIE_SECRET));
app.use(express.json());
app.use(logger);

app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  if (dbState === 1) {
    res.json({ status: 'ok', db: 'connected' });
  } else {
    res.status(503).json({ status: 'error', db: 'disconnected' });
  }
});

app.use('/api', routes);

app.use((req, res) => {
  res.status(404).json({ error: 'NotFoundError', message: 'Route not found' });
});

app.use(errorHandler);

export default app;
