import Feedback from '../models/Feedback.js';
import { NotFoundError, ForbiddenError } from '../middleware/errors.js';

const createFeedback = async ({ title, description, category, priority, actorId }) => {
  const feedback = await Feedback.create({
    title,
    description,
    category,
    priority,
    createdByActorId: actorId,
  });
  return feedback;
};

const listFeedback = async ({ category, priority, page = 1, limit = 50 }) => {
  const filter = {};

  if (category && priority) {
    filter.$and = [{ category }, { priority }];
  } else if (category) {
    filter.category = category;
  } else if (priority) {
    filter.priority = priority;
  }

  const skip = (page - 1) * limit;

  const [data, count] = await Promise.all([
    Feedback.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Feedback.countDocuments(filter),
  ]);

  return { data, count, page, limit };
};

const getFeedbackById = async (id) => {
  const feedback = await Feedback.findById(id);
  if (!feedback) {
    throw new NotFoundError();
  }
  return feedback;
};

const deleteFeedback = async (id, actorId) => {
  const feedback = await Feedback.findById(id);
  if (!feedback) {
    throw new NotFoundError();
  }

  if (feedback.createdByActorId.toString() !== actorId.toString()) {
    throw new ForbiddenError();
  }

  await Feedback.findByIdAndDelete(id);
  return feedback;
};

export default { createFeedback, listFeedback, getFeedbackById, deleteFeedback };
