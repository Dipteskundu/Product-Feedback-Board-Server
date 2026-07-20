import { Router } from 'express';
import deleteRequestController from '../controllers/deleteRequestController.js';
import requireAuth from '../middleware/requireAuth.js';
import requireRole from '../middleware/requireRole.js';
import { feedbackLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/', requireAuth, feedbackLimiter, deleteRequestController.createDeleteRequest);
router.get(
  '/',
  requireAuth,
  requireRole('admin', 'manager'),
  deleteRequestController.listDeleteRequests
);
router.put(
  '/:id/approve',
  requireAuth,
  requireRole('admin', 'manager'),
  deleteRequestController.approveDeleteRequest
);
router.put(
  '/:id/reject',
  requireAuth,
  requireRole('admin', 'manager'),
  deleteRequestController.rejectDeleteRequest
);

export default router;
