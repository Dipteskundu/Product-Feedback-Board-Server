import { Router } from 'express';
import feedbackController from '../controllers/feedbackController.js';
import { feedbackLimiter } from '../middleware/rateLimiter.js';
import validateRequest from '../middleware/validateRequest.js';
import ownership from '../middleware/ownership.js';
import requireAuth from '../middleware/requireAuth.js';
import requireRole from '../middleware/requireRole.js';
import Feedback from '../models/Feedback.js';
import { createFeedbackSchema, updateStatusSchema, updatePrioritySchema } from '../validators/feedbackValidators.js';
import commentRoutes from './commentRoutes.js';
import activityRoutes from './activityRoutes.js';

const router = Router();

router.post(
  '/',
  requireAuth,
  feedbackLimiter,
  validateRequest(createFeedbackSchema),
  feedbackController.createFeedback
);
router.get('/', feedbackController.listFeedback);
router.get('/related/:id', feedbackController.getRelatedFeedback);
router.get('/:id', feedbackController.getFeedback);
router.delete(
  '/:id',
  requireAuth,
  ownership((id) => Feedback.findById(id)),
  feedbackController.deleteFeedback
);
router.put(
  '/:id/status',
  requireAuth,
  requireRole('admin', 'manager'),
  feedbackLimiter,
  validateRequest(updateStatusSchema),
  feedbackController.updateStatus
);
router.put(
  '/:id/priority',
  requireAuth,
  requireRole('admin', 'manager'),
  feedbackLimiter,
  validateRequest(updatePrioritySchema),
  feedbackController.updatePriority
);

router.use('/:feedbackId/comments', commentRoutes);
router.use('/:feedbackId/activities', activityRoutes);

export default router;
