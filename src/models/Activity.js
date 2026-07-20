import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
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
    action: {
      type: String,
      required: true,
      enum: [
        'created',
        'status_changed',
        'priority_changed',
        'comment_added',
        'vote_cast',
        'deleted',
        'delete_requested',
        'delete_approved',
        'delete_rejected',
      ],
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

activitySchema.index({ feedbackId: 1, createdAt: -1 });

const Activity = mongoose.model('Activity', activitySchema);

export default Activity;
