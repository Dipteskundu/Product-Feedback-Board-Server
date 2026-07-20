import jwt from 'jsonwebtoken';
import Actor from '../models/Actor.js';
import { ValidationError, NotFoundError, UnauthorizedError } from '../middleware/errors.js';
import env from '../config/env.js';

function generateToken(actorId) {
  return jwt.sign({ actorId: actorId.toString() }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
}

function sanitizeUser(user) {
  return {
    _id: user._id,
    type: user.type,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}

export async function register({ name, email, password }) {
  const existing = await Actor.findOne({ email });
  if (existing) {
    throw new ValidationError('An account with this email already exists');
  }

  const user = await Actor.create({
    type: 'registered',
    name,
    email,
    password,
  });

  const token = generateToken(user._id);

  return { user: sanitizeUser(user), token };
}

export async function login({ email, password }) {
  const user = await Actor.findOne({ email }).select('+password');
  if (!user || user.type !== 'registered') {
    throw new UnauthorizedError('Invalid email or password');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const token = generateToken(user._id);

  return { user: sanitizeUser(user), token };
}

export async function getMe(actorId) {
  const user = await Actor.findById(actorId);
  if (!user) {
    throw new NotFoundError('User not found');
  }
  return sanitizeUser(user);
}
