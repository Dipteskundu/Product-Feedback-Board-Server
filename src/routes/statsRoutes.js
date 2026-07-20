import { Router } from 'express';
import feedbackController from '../controllers/feedbackController.js';

const router = Router();

router.get('/stats', feedbackController.getStats);

export default router;
