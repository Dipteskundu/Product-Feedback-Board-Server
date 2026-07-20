import { Router } from 'express';
import managerRequestController from '../controllers/managerRequestController.js';
import requireAuth from '../middleware/requireAuth.js';
import requireRole from '../middleware/requireRole.js';

const router = Router();

router.post('/', requireAuth, managerRequestController.createManagerRequest);
router.get('/', requireAuth, requireRole('admin'), managerRequestController.listManagerRequests);
router.put(
  '/:id/approve',
  requireAuth,
  requireRole('admin'),
  managerRequestController.approveManagerRequest
);
router.put(
  '/:id/reject',
  requireAuth,
  requireRole('admin'),
  managerRequestController.rejectManagerRequest
);

export default router;
