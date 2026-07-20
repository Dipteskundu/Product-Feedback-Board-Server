import mongoose from 'mongoose';
import managerRequestService from '../services/managerRequestService.js';
import { ValidationError } from '../middleware/errors.js';

const createManagerRequest = async (req, res, next) => {
  try {
    const request = await managerRequestService.createManagerRequest({
      actorId: req.actorId,
    });
    res.status(201).json(request);
  } catch (error) {
    next(error);
  }
};

const listManagerRequests = async (req, res, next) => {
  try {
    const { status } = req.query;
    const requests = await managerRequestService.listManagerRequests({ status });
    res.json(requests);
  } catch (error) {
    next(error);
  }
};

const approveManagerRequest = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new ValidationError('Invalid request ID');
    }
    const request = await managerRequestService.approveManagerRequest({
      requestId: req.params.id,
      adminId: req.actorId,
    });
    res.json(request);
  } catch (error) {
    next(error);
  }
};

const rejectManagerRequest = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new ValidationError('Invalid request ID');
    }
    const { note } = req.body;
    const request = await managerRequestService.rejectManagerRequest({
      requestId: req.params.id,
      adminId: req.actorId,
      note,
    });
    res.json(request);
  } catch (error) {
    next(error);
  }
};

export default {
  createManagerRequest,
  listManagerRequests,
  approveManagerRequest,
  rejectManagerRequest,
};
