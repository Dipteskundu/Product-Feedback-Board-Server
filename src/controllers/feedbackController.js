import mongoose from 'mongoose';
import feedbackService from '../services/feedbackService.js';
import { ValidationError } from '../middleware/errors.js';

const createFeedback = async (req, res, next) => {
  try {
    const feedback = await feedbackService.createFeedback({
      ...req.body,
      actorId: req.actorId,
    });
    res.status(201).json(feedback);
  } catch (error) {
    next(error);
  }
};

const listFeedback = async (req, res, next) => {
  try {
    const { category, priority, status, search, sort, page, limit, fromDate, toDate } = req.query;
    const result = await feedbackService.listFeedback({
      category,
      priority,
      status,
      search,
      sort,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 50,
      fromDate,
      toDate,
      actorId: req.actorId,
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getFeedback = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new ValidationError('Invalid feedback ID');
    }
    const feedback = await feedbackService.getFeedbackById(req.params.id, req.actorId);
    res.json(feedback);
  } catch (error) {
    next(error);
  }
};

const deleteFeedback = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new ValidationError('Invalid feedback ID');
    }
    await feedbackService.deleteFeedback(req.params.id, req.actorId);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new ValidationError('Invalid feedback ID');
    }
    const { status } = req.body;
    const feedback = await feedbackService.updateStatus(req.params.id, status, req.actorId);
    res.json(feedback);
  } catch (error) {
    next(error);
  }
};

const updatePriority = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new ValidationError('Invalid feedback ID');
    }
    const { priority } = req.body;
    const feedback = await feedbackService.updatePriority(req.params.id, priority, req.actorId);
    res.json(feedback);
  } catch (error) {
    next(error);
  }
};

const getStats = async (req, res, next) => {
  try {
    const stats = await feedbackService.getStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

const getRelatedFeedback = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new ValidationError('Invalid feedback ID');
    }
    const feedback = await feedbackService.getFeedbackById(req.params.id, req.actorId);
    const related = await feedbackService.getRelatedFeedback(req.params.id, feedback.category);
    res.json(related);
  } catch (error) {
    next(error);
  }
};

export default {
  createFeedback,
  listFeedback,
  getFeedback,
  deleteFeedback,
  updateStatus,
  updatePriority,
  getStats,
  getRelatedFeedback,
};
