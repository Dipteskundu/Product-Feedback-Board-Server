import Actor from '../models/Actor.js';
import { NotFoundError, ValidationError } from '../middleware/errors.js';

const listUsers = async ({ page = 1, limit = 50 } = {}) => {
  const skip = (page - 1) * limit;
  const [data, count] = await Promise.all([
    Actor.find({ type: 'registered' })
      .select('name email role createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Actor.countDocuments({ type: 'registered' }),
  ]);
  return { data, count, page, limit };
};

const updateUserRole = async ({ userId, role, adminId }) => {
  if (userId === adminId.toString()) {
    throw new ValidationError('You cannot change your own role');
  }

  const user = await Actor.findById(userId);
  if (!user) throw new NotFoundError('User not found');
  if (user.type !== 'registered')
    throw new ValidationError('Cannot change role of anonymous users');

  user.role = role;
  await user.save();

  return { _id: user._id, name: user.name, email: user.email, role: user.role };
};

const getUserById = async (userId) => {
  const user = await Actor.findById(userId).select('name email role createdAt');
  if (!user) throw new NotFoundError('User not found');
  return user;
};

export default { listUsers, updateUserRole, getUserById };
