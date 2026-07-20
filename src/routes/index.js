import { Router } from 'express';
import authRoutes from './authRoutes.js';
import feedbackRoutes from './feedbackRoutes.js';
import voteRoutes from './voteRoutes.js';
import healthRoutes from './healthRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/feedback', feedbackRoutes);
router.use('/feedback', voteRoutes);
router.use(healthRoutes);

export default router;
