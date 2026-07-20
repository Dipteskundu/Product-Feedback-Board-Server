import { Router } from 'express';
import feedbackController from '../controllers/feedbackController.js';
import { feedbackLimiter } from '../middleware/rateLimiter.js';
import validateRequest from '../middleware/validateRequest.js';
import ownership from '../middleware/ownership.js';
import Feedback from '../models/Feedback.js';
import {
  createFeedbackSchema,
  updateStatusSchema,
  updatePrioritySchema,
} from '../validators/feedbackValidators.js';
import commentRoutes from './commentRoutes.js';
import activityRoutes from './activityRoutes.js';

const router = Router();

router.post(
  '/',
  feedbackLimiter,
  validateRequest(createFeedbackSchema),
  feedbackController.createFeedback
);
router.get('/', feedbackController.listFeedback);
router.get('/related/:id', feedbackController.getRelatedFeedback);
router.get('/:id', feedbackController.getFeedback);
router.delete(
  '/:id',
  ownership((id) => Feedback.findById(id)),
  feedbackController.deleteFeedback
);
router.put(
  '/:id/status',
  feedbackLimiter,
  validateRequest(updateStatusSchema),
  feedbackController.updateStatus
);
router.put(
  '/:id/priority',
  feedbackLimiter,
  validateRequest(updatePrioritySchema),
  feedbackController.updatePriority
);

router.use('/:feedbackId/comments', commentRoutes);
router.use('/:feedbackId/activities', activityRoutes);

export default router;
