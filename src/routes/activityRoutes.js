import { Router } from 'express';
import activityService from '../services/activityService.js';
import mongoose from 'mongoose';
import { ValidationError } from '../middleware/errors.js';

const router = Router({ mergeParams: true });

router.get('/', async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.feedbackId)) {
      throw new ValidationError('Invalid feedback ID');
    }
    const activities = await activityService.listActivities(req.params.feedbackId);
    res.json(activities);
  } catch (error) {
    next(error);
  }
});

export default router;
