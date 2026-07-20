import Comment from '../models/Comment.js';
import Feedback from '../models/Feedback.js';
import activityService from './activityService.js';
import { NotFoundError, ForbiddenError } from '../middleware/errors.js';

const createComment = async ({ feedbackId, actorId, body, parentId = null }) => {
  const feedback = await Feedback.findById(feedbackId);
  if (!feedback) throw new NotFoundError();

  const comment = await Comment.create({
    feedbackId,
    actorId,
    body,
    parentId: parentId || null,
  });

  await Feedback.findByIdAndUpdate(feedbackId, { $inc: { commentCount: 1 } });

  await activityService.logActivity({
    feedbackId,
    actorId,
    action: 'comment_added',
    details: { body: body.substring(0, 100) },
  });

  return comment;
};

const listComments = async (feedbackId) => {
  const comments = await Comment.find({ feedbackId })
    .populate('actorId', 'name')
    .sort({ createdAt: 1 })
    .lean();

  const topLevel = comments.filter((c) => !c.parentId);
  const replies = comments.filter((c) => c.parentId);

  return topLevel.map((comment) => ({
    ...comment,
    replies: replies.filter((r) => r.parentId.toString() === comment._id.toString()),
  }));
};

const deleteComment = async (id, actorId) => {
  const comment = await Comment.findById(id);
  if (!comment) throw new NotFoundError();

  if (comment.actorId.toString() !== actorId.toString()) {
    throw new ForbiddenError();
  }

  await Comment.findByIdAndDelete(id);
  await Feedback.findByIdAndUpdate(comment.feedbackId, { $inc: { commentCount: -1 } });

  return comment;
};

export default { createComment, listComments, deleteComment };
