import mongoose from 'mongoose';
import deleteRequestService from '../services/deleteRequestService.js';
import { ValidationError } from '../middleware/errors.js';

const createDeleteRequest = async (req, res, next) => {
  try {
    const { feedbackId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(feedbackId)) {
      throw new ValidationError('Invalid feedback ID');
    }
    const request = await deleteRequestService.createDeleteRequest({
      feedbackId,
      actorId: req.actorId,
    });
    res.status(201).json(request);
  } catch (error) {
    next(error);
  }
};

const listDeleteRequests = async (req, res, next) => {
  try {
    const { status } = req.query;
    const requests = await deleteRequestService.listDeleteRequests({ status });
    res.json(requests);
  } catch (error) {
    next(error);
  }
};

const approveDeleteRequest = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new ValidationError('Invalid request ID');
    }
    const request = await deleteRequestService.approveDeleteRequest({
      requestId: req.params.id,
      actorId: req.actorId,
    });
    res.json(request);
  } catch (error) {
    next(error);
  }
};

const rejectDeleteRequest = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new ValidationError('Invalid request ID');
    }
    const { note } = req.body;
    const request = await deleteRequestService.rejectDeleteRequest({
      requestId: req.params.id,
      actorId: req.actorId,
      note,
    });
    res.json(request);
  } catch (error) {
    next(error);
  }
};

export default {
  createDeleteRequest,
  listDeleteRequests,
  approveDeleteRequest,
  rejectDeleteRequest,
};
