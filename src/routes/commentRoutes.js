import { Router } from 'express';
import commentController from '../controllers/commentController.js';
import validateRequest from '../middleware/validateRequest.js';
import { createCommentSchema } from '../validators/commentValidators.js';

const router = Router({ mergeParams: true });

router.post('/', validateRequest(createCommentSchema), commentController.createComment);
router.get('/', commentController.listComments);
router.delete('/:id', commentController.deleteComment);

export default router;
