import mongoose from 'mongoose';
import feedbackService from '../services/feedbackService.js';
import { ValidationError } from '../middleware/errors.js';

const createFeedback = async (req, res, next) => {
  try {
    const { title, description, category, priority } = req.body;
    const feedback = await feedbackService.createFeedback({
      title,
      description,
      category,
      priority,
      actorId: req.actorId,
    });
    res.status(201).json(feedback);
  } catch (error) {
    next(error);
  }
};

const listFeedback = async (req, res, next) => {
  try {
    const { category, priority, page, limit } = req.query;
    const result = await feedbackService.listFeedback({
      category,
      priority,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 50,
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
    const feedback = await feedbackService.getFeedbackById(req.params.id);
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

export default { createFeedback, listFeedback, getFeedback, deleteFeedback };
