import DeleteRequest from '../models/DeleteRequest.js';
import Feedback from '../models/Feedback.js';
import activityService from './activityService.js';
import { NotFoundError, ForbiddenError, ValidationError } from '../middleware/errors.js';

const createDeleteRequest = async ({ feedbackId, actorId }) => {
  const feedback = await Feedback.findById(feedbackId);
  if (!feedback) throw new NotFoundError('Feedback not found');

  if (feedback.createdByActorId.toString() !== actorId.toString()) {
    throw new ForbiddenError('You can only request deletion of your own feedback');
  }

  const existing = await DeleteRequest.findOne({
    feedbackId,
    status: 'pending',
  });
  if (existing) {
    throw new ValidationError('A delete request already exists for this feedback');
  }

  const request = await DeleteRequest.create({
    feedbackId,
    requestedByActorId: actorId,
  });

  await activityService.logActivity({
    feedbackId,
    actorId,
    action: 'delete_requested',
  });

  return request;
};

const listDeleteRequests = async ({ status } = {}) => {
  const filter = {};
  if (status) filter.status = status;

  return DeleteRequest.find(filter)
    .populate('feedbackId', 'title category status')
    .populate('requestedByActorId', 'name email')
    .populate('reviewedByActorId', 'name email')
    .sort({ createdAt: -1 });
};

const approveDeleteRequest = async ({ requestId, actorId }) => {
  const request = await DeleteRequest.findById(requestId);
  if (!request) throw new NotFoundError('Delete request not found');
  if (request.status !== 'pending')
    throw new ValidationError('This request has already been processed');

  const feedback = await Feedback.findById(request.feedbackId);
  if (!feedback) throw new NotFoundError('Feedback no longer exists');

  const originalCreatorId = feedback.createdByActorId;

  await Feedback.findByIdAndDelete(request.feedbackId);

  request.status = 'approved';
  request.reviewedByActorId = actorId;
  await request.save();

  await activityService.logActivity({
    feedbackId: request.feedbackId,
    actorId,
    action: 'delete_approved',
    details: { originalCreatorId, requestedByActorId: request.requestedByActorId },
  });

  return request;
};

const rejectDeleteRequest = async ({ requestId, actorId, note }) => {
  const request = await DeleteRequest.findById(requestId);
  if (!request) throw new NotFoundError('Delete request not found');
  if (request.status !== 'pending')
    throw new ValidationError('This request has already been processed');

  request.status = 'rejected';
  request.reviewedByActorId = actorId;
  request.reviewNote = note || '';
  await request.save();

  await activityService.logActivity({
    feedbackId: request.feedbackId,
    actorId,
    action: 'delete_rejected',
    details: { requestedByActorId: request.requestedByActorId, note },
  });

  return request;
};

const getPendingRequestForFeedback = async (feedbackId) => {
  return DeleteRequest.findOne({ feedbackId, status: 'pending' });
};

const getUserNotifications = async (actorId) => {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  const recentApproved = await DeleteRequest.find({
    requestedByActorId: actorId,
    status: 'approved',
    updatedAt: { $gte: oneHourAgo },
  })
    .populate('feedbackId', 'title')
    .populate('reviewedByActorId', 'name')
    .sort({ updatedAt: -1 })
    .limit(5);

  return recentApproved.map((req) => ({
    id: req._id,
    type: 'delete_approved',
    message: `Your feedback "${req.feedbackId?.title || 'Unknown'}" has been deleted by ${req.reviewedByActorId?.name || 'a manager'}.`,
    createdAt: req.updatedAt,
  }));
};

export default {
  createDeleteRequest,
  listDeleteRequests,
  approveDeleteRequest,
  rejectDeleteRequest,
  getPendingRequestForFeedback,
  getUserNotifications,
};
