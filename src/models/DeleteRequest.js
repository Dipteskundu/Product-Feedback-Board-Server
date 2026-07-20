import mongoose from 'mongoose';

const deleteRequestSchema = new mongoose.Schema(
  {
    feedbackId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Feedback',
      required: true,
    },
    requestedByActorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Actor',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    reviewedByActorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Actor',
    },
    reviewNote: {
      type: String,
      trim: true,
      maxlength: 200,
    },
  },
  { timestamps: true }
);

deleteRequestSchema.index({ feedbackId: 1, status: 1 });
deleteRequestSchema.index({ requestedByActorId: 1, status: 1 });

const DeleteRequest = mongoose.model('DeleteRequest', deleteRequestSchema);

export default DeleteRequest;
