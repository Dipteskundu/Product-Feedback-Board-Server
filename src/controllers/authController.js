import authService from '../services/authService.js';

const register = async (req, res, next) => {
  try {
    const { name, email, password, gender } = req.body;
    const user = await authService.register({ name, email, password, gender });
    res.cookie('userId', user.id.toString(), {
      httpOnly: true,
      signed: true,
      maxAge: 365 * 24 * 60 * 60 * 1000,
    });
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await authService.login({ email, password });
    res.cookie('userId', user.id.toString(), {
      httpOnly: true,
      signed: true,
      maxAge: 365 * 24 * 60 * 60 * 1000,
    });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res) => {
  res.clearCookie('userId');
  res.status(204).end();
};

const me = async (req, res, next) => {
  try {
    const userId = req.signedCookies?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Not logged in' });
    }
    const User = (await import('../models/User.js')).default;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized', message: 'User not found' });
    }
    res.json({ id: user._id, name: user.name, email: user.email, gender: user.gender });
  } catch (error) {
    next(error);
  }
};

export default { register, login, logout, me };
