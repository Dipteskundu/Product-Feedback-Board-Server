import { Router } from 'express';
import commentController from '../controllers/commentController.js';
import validateRequest from '../middleware/validateRequest.js';
import requireAuth from '../middleware/requireAuth.js';
import { createCommentSchema } from '../validators/commentValidators.js';

const router = Router({ mergeParams: true });

router.post(
  '/',
  requireAuth,
  validateRequest(createCommentSchema),
  commentController.createComment
);
router.get('/', requireAuth, commentController.listComments);
router.delete('/:id', requireAuth, commentController.deleteComment);

export default router;
