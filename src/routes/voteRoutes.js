import { Router } from 'express';
import voteController from '../controllers/voteController.js';
import { voteLimiter } from '../middleware/rateLimiter.js';
import validateRequest from '../middleware/validateRequest.js';
import { voteSchema } from '../validators/voteValidators.js';

const router = Router();

router.put('/:id/vote', voteLimiter, validateRequest(voteSchema), voteController.castVote);

export default router;
