import mongoose from 'mongoose';

const actorSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['anonymous', 'registered'],
      default: 'anonymous',
    },
  },
  { timestamps: true }
);

const Actor = mongoose.model('Actor', actorSchema);

export default Actor;
