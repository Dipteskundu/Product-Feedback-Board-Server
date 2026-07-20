import jwt from 'jsonwebtoken';
import Actor from '../models/Actor.js';
import env from '../config/env.js';

const isProd = process.env.NODE_ENV === 'production';

const resolveActor = async (req, res, next) => {
  try {
    // First, check for JWT token (registered user)
    let token = null;
    if (req.signedCookies?.token) {
      token = req.signedCookies.token;
    }
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, env.JWT_SECRET);
        const actor = await Actor.findById(decoded.actorId);
        if (actor) {
          req.actorId = actor._id;
          return next();
        }
      } catch {
        // Token invalid or expired, fall through to anonymous
      }
    }

    // Fallback: check for anonymous actor cookie
    const signedCookie = req.signedCookies?.actorId;
    if (signedCookie) {
      req.actorId = signedCookie;
      return next();
    }

    // Create new anonymous actor
    const actor = await Actor.create({ type: 'anonymous' });

    res.cookie('actorId', actor._id.toString(), {
      httpOnly: true,
      signed: true,
      sameSite: isProd ? 'none' : 'lax',
      secure: isProd,
      maxAge: 365 * 24 * 60 * 60 * 1000,
    });

    req.actorId = actor._id;
    next();
  } catch (error) {
    next(error);
  }
};

export default resolveActor;
