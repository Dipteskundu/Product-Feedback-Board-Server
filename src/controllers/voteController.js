import mongoose from 'mongoose';
import voteService from '../services/voteService.js';
import { ValidationError } from '../middleware/errors.js';

const castVote = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new ValidationError('Invalid feedback ID');
    }
    const { voteType } = req.body;
    const result = await voteService.castVote({
      feedbackId: req.params.id,
      actorId: req.actorId,
      voteType,
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export default { castVote };
