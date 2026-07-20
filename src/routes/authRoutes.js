import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import validateRequest from '../middleware/validateRequest.js';
import requireAuth from '../middleware/requireAuth.js';
import { registerSchema, loginSchema } from '../validators/authValidators.js';

const router = Router();

router.post('/register', validateRequest(registerSchema), authController.register);
router.post('/login', validateRequest(loginSchema), authController.login);
router.post('/logout', authController.logout);
router.get('/me', requireAuth, authController.getMe);

export default router;
