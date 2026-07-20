import mongoose from 'mongoose';

const managerRequestSchema = new mongoose.Schema(
  {
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

managerRequestSchema.index({ requestedByActorId: 1, status: 1 });

const ManagerRequest = mongoose.model('ManagerRequest', managerRequestSchema);

export default ManagerRequest;
