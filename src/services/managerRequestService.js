import ManagerRequest from '../models/ManagerRequest.js';
import Actor from '../models/Actor.js';
import { NotFoundError, ValidationError } from '../middleware/errors.js';

const createManagerRequest = async ({ actorId }) => {
  const actor = await Actor.findById(actorId);
  if (!actor) throw new NotFoundError('User not found');

  if (actor.role === 'manager' || actor.role === 'admin') {
    throw new ValidationError('You already have manager or admin privileges');
  }

  const existing = await ManagerRequest.findOne({
    requestedByActorId: actorId,
    status: 'pending',
  });
  if (existing) {
    throw new ValidationError('You already have a pending manager request');
  }

  return ManagerRequest.create({
    requestedByActorId: actorId,
  });
};

const listManagerRequests = async ({ status } = {}) => {
  const filter = {};
  if (status) filter.status = status;

  return ManagerRequest.find(filter)
    .populate('requestedByActorId', 'name email role')
    .populate('reviewedByActorId', 'name email')
    .sort({ createdAt: -1 });
};

const approveManagerRequest = async ({ requestId, adminId }) => {
  const request = await ManagerRequest.findById(requestId);
  if (!request) throw new NotFoundError('Manager request not found');
  if (request.status !== 'pending')
    throw new ValidationError('This request has already been processed');

  await Actor.findByIdAndUpdate(request.requestedByActorId, { role: 'manager' });

  request.status = 'approved';
  request.reviewedByActorId = adminId;
  await request.save();

  return request;
};

const rejectManagerRequest = async ({ requestId, adminId, note }) => {
  const request = await ManagerRequest.findById(requestId);
  if (!request) throw new NotFoundError('Manager request not found');
  if (request.status !== 'pending')
    throw new ValidationError('This request has already been processed');

  request.status = 'rejected';
  request.reviewedByActorId = adminId;
  request.reviewNote = note || '';
  await request.save();

  return request;
};

export default {
  createManagerRequest,
  listManagerRequests,
  approveManagerRequest,
  rejectManagerRequest,
};
