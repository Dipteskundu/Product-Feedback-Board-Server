import { Router } from 'express';
import userController from '../controllers/userController.js';
import requireAuth from '../middleware/requireAuth.js';
import requireRole from '../middleware/requireRole.js';
import validateRequest from '../middleware/validateRequest.js';
import { updateRoleSchema } from '../validators/userValidators.js';

const router = Router();

router.get('/', requireAuth, requireRole('admin'), userController.listUsers);
router.put(
  '/:id/role',
  requireAuth,
  requireRole('admin'),
  validateRequest(updateRoleSchema),
  userController.updateUserRole
);
router.get('/:id', requireAuth, requireRole('admin'), userController.getUser);

export default router;
