import crypto from 'crypto';
import User from '../models/User.js';
import { ValidationError } from '../middleware/errors.js';

const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
};

const verifyPassword = (password, stored) => {
  const [salt, hash] = stored.split(':');
  const verify = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return hash === verify;
};

const register = async ({ name, email, password, gender }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    throw new ValidationError('Email already in use');
  }

  const hashedPassword = hashPassword(password);
  const user = await User.create({ name, email, password: hashedPassword, gender });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    gender: user.gender,
  };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new ValidationError('Invalid email or password');
  }

  const isValid = verifyPassword(password, user.password);
  if (!isValid) {
    throw new ValidationError('Invalid email or password');
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    gender: user.gender,
  };
};

export default { register, login };
