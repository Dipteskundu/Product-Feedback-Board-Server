import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 1000,
    },
    category: {
      type: String,
      required: true,
      enum: ['Bug', 'Feature', 'Improvement'],
    },
    priority: {
      type: String,
      required: true,
      enum: ['Low', 'Medium', 'High'],
    },
    createdByActorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Actor',
      required: true,
    },
    status: {
      type: String,
      enum: ['Open', 'Planned', 'In Progress', 'Done'],
      default: 'Open',
    },
    upvoteCount: {
      type: Number,
      default: 0,
    },
    downvoteCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

feedbackSchema.index({ category: 1, priority: 1, createdAt: -1 });

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;
