import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import env from './config/env.js';
import logger from './middleware/logger.js';
import resolveActor from './middleware/resolveActor.js';
import errorHandler from './middleware/errorHandler.js';
import routes from './routes/index.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(compression());
app.use(cookieParser(env.COOKIE_SECRET));
app.use(express.json());
app.use(logger);
app.use(resolveActor);

app.use('/api', routes);

app.use((req, res) => {
  res.status(404).json({ error: 'NotFoundError', message: 'Route not found' });
});

app.use(errorHandler);

export default app;
