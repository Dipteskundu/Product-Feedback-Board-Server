import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';
import env from './config/env.js';
import logger from './middleware/logger.js';
import resolveActor from './middleware/resolveActor.js';
import errorHandler from './middleware/errorHandler.js';
import routes from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const clientDist = join(__dirname, '..', '..', '..', 'client', 'dist');

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(compression());
app.use(cookieParser(env.COOKIE_SECRET));
app.use(express.json());
app.use(logger);
app.use(resolveActor);

app.use('/api', routes);

if (existsSync(clientDist)) {
  app.use(express.static(clientDist));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(join(clientDist, 'index.html'));
  });
}

app.use((req, res) => {
  res.status(404).json({ error: 'NotFoundError', message: 'Route not found' });
});

app.use(errorHandler);

export default app;
