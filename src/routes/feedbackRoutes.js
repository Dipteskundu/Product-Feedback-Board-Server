import { Router } from 'express';
import feedbackController from '../controllers/feedbackController.js';
import { feedbackLimiter } from '../middleware/rateLimiter.js';
import validateRequest from '../middleware/validateRequest.js';
import ownership from '../middleware/ownership.js';
import Feedback from '../models/Feedback.js';
import { createFeedbackSchema } from '../validators/feedbackValidators.js';

const router = Router();

router.post(
  '/',
  feedbackLimiter,
  validateRequest(createFeedbackSchema),
  feedbackController.createFeedback
);
router.get('/', feedbackController.listFeedback);
router.get('/:id', feedbackController.getFeedback);
router.delete(
  '/:id',
  ownership((id) => Feedback.findById(id)),
  feedbackController.deleteFeedback
);

export default router;
