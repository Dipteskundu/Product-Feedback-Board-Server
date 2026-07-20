import deleteRequestService from '../services/deleteRequestService.js';

const getNotifications = async (req, res, next) => {
  try {
    const notifications = await deleteRequestService.getUserNotifications(req.actorId);
    res.json(notifications);
  } catch (error) {
    next(error);
  }
};

export default { getNotifications };
