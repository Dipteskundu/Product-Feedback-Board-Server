import Actor from '../models/Actor.js';

const resolveActor = async (req, res, next) => {
  try {
    const signedCookie = req.signedCookies?.actorId;

    if (signedCookie) {
      req.actorId = signedCookie;
      return next();
    }

    const actor = await Actor.create({ type: 'anonymous' });

    res.cookie('actorId', actor._id.toString(), {
      httpOnly: true,
      signed: true,
      maxAge: 365 * 24 * 60 * 60 * 1000,
    });

    req.actorId = actor._id;
    next();
  } catch (error) {
    next(error);
  }
};

export default resolveActor;
