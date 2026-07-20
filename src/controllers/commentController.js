import mongoose from 'mongoose';
import commentService from '../services/commentService.js';
import { ValidationError } from '../middleware/errors.js';

const createComment = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.feedbackId)) {
      throw new ValidationError('Invalid feedback ID');
    }
    const { body, parentId } = req.body;
    const comment = await commentService.createComment({
      feedbackId: req.params.feedbackId,
      actorId: req.actorId,
      body,
      parentId,
    });
    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
};

const listComments = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.feedbackId)) {
      throw new ValidationError('Invalid feedback ID');
    }
    const comments = await commentService.listComments(req.params.feedbackId);
    res.json(comments);
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new ValidationError('Invalid comment ID');
    }
    await commentService.deleteComment(req.params.id, req.actorId);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export default { createComment, listComments, deleteComment };
