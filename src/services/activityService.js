import Activity from '../models/Activity.js';

const logActivity = async ({ feedbackId, actorId, action, details = {} }) => {
  return Activity.create({ feedbackId, actorId, action, details });
};

const listActivities = async (feedbackId) => {
  return Activity.find({ feedbackId }).sort({ createdAt: -1 });
};

export default { logActivity, listActivities };
