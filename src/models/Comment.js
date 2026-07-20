import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    feedbackId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Feedback',
      required: true,
    },
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Actor',
      required: true,
    },
    body: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 2000,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
    },
  },
  { timestamps: true }
);

commentSchema.index({ feedbackId: 1, createdAt: -1 });
commentSchema.index({ parentId: 1 });

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
