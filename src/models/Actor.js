import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const actorSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['anonymous', 'registered'],
      default: 'anonymous',
    },
    name: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'manager', 'admin'],
      default: 'user',
    },
  },
  { timestamps: true }
);

actorSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return;
  this.password = await bcrypt.hash(this.password, 10);
});

actorSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const Actor = mongoose.model('Actor', actorSchema);

export default Actor;
