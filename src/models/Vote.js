import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema(
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
    voteType: {
      type: String,
      required: true,
      enum: ['up', 'down'],
    },
  },
  { timestamps: true }
);

voteSchema.index({ feedbackId: 1, actorId: 1 }, { unique: true });
voteSchema.index({ actorId: 1 });

const Vote = mongoose.model('Vote', voteSchema);

export default Vote;
