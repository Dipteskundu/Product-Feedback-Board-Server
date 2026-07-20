import Feedback from '../models/Feedback.js';
import Vote from '../models/Vote.js';
import Actor from '../models/Actor.js';
import activityService from './activityService.js';
import { NotFoundError, ForbiddenError } from '../middleware/errors.js';

const createFeedback = async ({ title, description, category, priority, actorId }) => {
  const feedback = await Feedback.create({
    title,
    description,
    category,
    priority,
    createdByActorId: actorId,
  });

  await activityService.logActivity({
    feedbackId: feedback._id,
    actorId,
    action: 'created',
  });

  return feedback.toObject();
};

const listFeedback = async ({
  category,
  priority,
  status,
  search,
  sort = 'newest',
  page = 1,
  limit = 50,
  fromDate,
  toDate,
  actorId,
}) => {
  const filter = {};

  if (search) {
    filter.$text = { $search: search };
  }

  if (category && priority) {
    filter.$and = [{ category }, { priority }];
  } else if (category) {
    filter.category = category;
  } else if (priority) {
    filter.priority = priority;
  }

  if (status) {
    const statusList = status.split(',').map((s) => s.trim());
    filter.status = statusList.length === 1 ? statusList[0] : { $in: statusList };
  }

  if (fromDate || toDate) {
    filter.createdAt = {};
    if (fromDate) filter.createdAt.$gte = new Date(fromDate);
    if (toDate) filter.createdAt.$lte = new Date(toDate);
  }

  const sortMap = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    most_voted: { upvoteCount: -1 },
    least_voted: { upvoteCount: 1 },
    high_priority: { priority: -1, createdAt: -1 },
    recently_updated: { updatedAt: -1 },
  };

  const sortOption = sortMap[sort] || sortMap.newest;
  const skip = (page - 1) * limit;

  const [data, count] = await Promise.all([
    Feedback.find(filter).sort(sortOption).skip(skip).limit(limit),
    Feedback.countDocuments(filter),
  ]);

  let userVotes = {};
  if (actorId && data.length > 0) {
    const feedbackIds = data.map((f) => f._id);
    const votes = await Vote.find({ feedbackId: { $in: feedbackIds }, actorId });
    votes.forEach((v) => {
      userVotes[v.feedbackId.toString()] = v.voteType;
    });
  }

  const dataWithVotes = data.map((item) => ({
    ...item.toObject(),
    userVote: userVotes[item._id.toString()] || null,
  }));

  return { data: dataWithVotes, count, page, limit };
};

const getFeedbackById = async (id, actorId) => {
  const feedback = await Feedback.findById(id);
  if (!feedback) throw new NotFoundError();

  let userVote = null;
  if (actorId) {
    const vote = await Vote.findOne({ feedbackId: id, actorId });
    userVote = vote ? vote.voteType : null;
  }

  return { ...feedback.toObject(), userVote };
};

const deleteFeedback = async (id, actorId) => {
  const feedback = await Feedback.findById(id);
  if (!feedback) throw new NotFoundError();

  const actor = await Actor.findById(actorId);
  const isManagerOrAdmin = actor && (actor.role === 'manager' || actor.role === 'admin');

  if (!isManagerOrAdmin) {
    if (feedback.createdByActorId.toString() !== actorId.toString()) {
      throw new ForbiddenError('You can only delete your own feedback');
    }
    throw new ForbiddenError(
      'Only managers and admins can delete feedback directly. Please submit a delete request.'
    );
  }

  await Feedback.findByIdAndDelete(id);

  await activityService.logActivity({
    feedbackId: id,
    actorId,
    action: 'deleted',
  });

  return feedback;
};

const updateStatus = async (id, status, actorId) => {
  const feedback = await Feedback.findById(id);
  if (!feedback) throw new NotFoundError();

  const actor = await Actor.findById(actorId);
  if (!actor || (actor.role !== 'manager' && actor.role !== 'admin')) {
    throw new ForbiddenError('Only managers and admins can update feedback status');
  }

  const from = feedback.status;
  feedback.status = status;
  await feedback.save();

  await activityService.logActivity({
    feedbackId: id,
    actorId,
    action: 'status_changed',
    details: { from, to: status },
  });

  return feedback;
};

const updatePriority = async (id, priority, actorId) => {
  const feedback = await Feedback.findById(id);
  if (!feedback) throw new NotFoundError();

  const actor = await Actor.findById(actorId);
  if (!actor || (actor.role !== 'manager' && actor.role !== 'admin')) {
    throw new ForbiddenError('Only managers and admins can update feedback priority');
  }

  const from = feedback.priority;
  feedback.priority = priority;
  await feedback.save();

  await activityService.logActivity({
    feedbackId: id,
    actorId,
    action: 'priority_changed',
    details: { from, to: priority },
  });

  return feedback;
};

const getStats = async () => {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [
    totalFeedback,
    openCount,
    completedCount,
    highPriorityCount,
    thisWeekCount,
    categoryBreakdown,
    priorityBreakdown,
    recentTrend,
  ] = await Promise.all([
    Feedback.countDocuments(),
    Feedback.countDocuments({ status: { $in: ['Open', 'Under Review'] } }),
    Feedback.countDocuments({ status: 'Completed' }),
    Feedback.countDocuments({ priority: 'High' }),
    Feedback.countDocuments({ createdAt: { $gte: weekAgo } }),
    Feedback.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    Feedback.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    Feedback.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 30 },
    ]),
  ]);

  const mostVoted = await Feedback.findOne().sort({ upvoteCount: -1 }).limit(1);

  return {
    totalFeedback,
    openCount,
    completedCount,
    highPriorityCount,
    thisWeekCount,
    mostVoted: mostVoted ? { title: mostVoted.title, upvoteCount: mostVoted.upvoteCount } : null,
    categoryBreakdown,
    priorityBreakdown,
    recentTrend,
  };
};

const getRelatedFeedback = async (id, category) => {
  return Feedback.find({ _id: { $ne: id }, category })
    .sort({ upvoteCount: -1 })
    .limit(5)
    .lean();
};

export default {
  createFeedback,
  listFeedback,
  getFeedbackById,
  deleteFeedback,
  updateStatus,
  updatePriority,
  getStats,
  getRelatedFeedback,
};
