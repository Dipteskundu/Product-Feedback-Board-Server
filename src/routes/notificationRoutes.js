import { Router } from 'express';
import notificationController from '../controllers/notificationController.js';
import requireAuth from '../middleware/requireAuth.js';

const router = Router();

router.get('/', requireAuth, notificationController.getNotifications);

export default router;
