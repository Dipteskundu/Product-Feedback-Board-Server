import { Router } from 'express';
import feedbackRoutes from './feedbackRoutes.js';
import voteRoutes from './voteRoutes.js';
import statsRoutes from './statsRoutes.js';
import healthRoutes from './healthRoutes.js';

const router = Router();

router.use('/feedback', feedbackRoutes);
router.use('/feedback', voteRoutes);
router.use(statsRoutes);
router.use(healthRoutes);

export default router;
