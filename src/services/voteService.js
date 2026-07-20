import mongoose from 'mongoose';
import Vote from '../models/Vote.js';
import Feedback from '../models/Feedback.js';
import { NotFoundError } from '../middleware/errors.js';

const castVote = async ({ feedbackId, actorId, voteType }) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const feedback = await Feedback.findById(feedbackId).session(session);
    if (!feedback) {
      throw new NotFoundError();
    }

    const previousVote = await Vote.findOne({ feedbackId, actorId }).session(session);

    let upDelta = 0;
    let downDelta = 0;

    if (!previousVote) {
      if (voteType === 'up') upDelta = 1;
      else downDelta = 1;
    } else if (previousVote.voteType !== voteType) {
      if (voteType === 'up') {
        upDelta = 1;
        downDelta = -1;
      } else {
        upDelta = -1;
        downDelta = 1;
      }
    }

    await Vote.findOneAndUpdate(
      { feedbackId, actorId },
      { voteType },
      { upsert: true, new: true, session }
    );

    const updated = await Feedback.findByIdAndUpdate(
      feedbackId,
      { $inc: { upvoteCount: upDelta, downvoteCount: downDelta } },
      { new: true, session }
    );

    await session.commitTransaction();

    return {
      feedbackId: updated._id,
      upvoteCount: updated.upvoteCount,
      downvoteCount: updated.downvoteCount,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export default { castVote };
