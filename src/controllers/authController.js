import * as authService from '../services/authService.js';

const isProd = process.env.NODE_ENV === 'production';

const COOKIE_OPTIONS = {
  httpOnly: true,
  signed: true,
  sameSite: isProd ? 'none' : 'lax',
  secure: isProd,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/',
};

export async function register(req, res, next) {
  try {
    const { user, token } = await authService.register(req.body);

    res.cookie('token', token, COOKIE_OPTIONS);

    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { user, token } = await authService.login(req.body);

    res.cookie('token', token, COOKIE_OPTIONS);

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
}

export function logout(req, res) {
  res.clearCookie('token', {
    httpOnly: true,
    signed: true,
    sameSite: isProd ? 'none' : 'lax',
    secure: isProd,
    path: '/',
  });
  res.status(204).end();
}

export async function getMe(req, res, next) {
  try {
    const user = await authService.getMe(req.actorId);
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
}
