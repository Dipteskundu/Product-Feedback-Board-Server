import jwt from 'jsonwebtoken';
import Actor from '../models/Actor.js';
import { UnauthorizedError } from './errors.js';
import env from '../config/env.js';

const requireAuth = async (req, res, next) => {
  try {
    let token = null;

    // Check for token in signed cookies
    if (req.signedCookies?.token) {
      token = req.signedCookies.token;
    }

    // Fallback to Authorization header
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new UnauthorizedError('Please log in to access this resource');
    }

    let decoded;
    try {
      decoded = jwt.verify(token, env.JWT_SECRET);
    } catch {
      throw new UnauthorizedError('Invalid or expired token. Please log in again');
    }

    const actor = await Actor.findById(decoded.actorId);
    if (!actor) {
      throw new UnauthorizedError('User no longer exists');
    }

    req.actorId = actor._id;
    req.user = actor;
    next();
  } catch (error) {
    next(error);
  }
};

export default requireAuth;
