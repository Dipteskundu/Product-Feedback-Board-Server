import { Router } from 'express';
import feedbackRoutes from './feedbackRoutes.js';
import voteRoutes from './voteRoutes.js';
import statsRoutes from './statsRoutes.js';
import healthRoutes from './healthRoutes.js';
import authRoutes from './authRoutes.js';
import deleteRequestRoutes from './deleteRequestRoutes.js';
import managerRequestRoutes from './managerRequestRoutes.js';
import userRoutes from './userRoutes.js';
import notificationRoutes from './notificationRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/feedback', feedbackRoutes);
router.use('/feedback', voteRoutes);
router.use('/delete-requests', deleteRequestRoutes);
router.use('/manager-requests', managerRequestRoutes);
router.use('/users', userRoutes);
router.use('/notifications', notificationRoutes);
router.use(statsRoutes);
router.use(healthRoutes);

export default router;
