import { Router } from 'express';
import { register, login, refresh, logout, getMe } from '../controllers/authController.js';
import { protect, requireDB } from '../middleware/auth.js';
import { validateRegister, validateLogin } from '../middleware/validators.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/register', requireDB, authLimiter, validateRegister, register);
router.post('/login', requireDB, authLimiter, validateLogin, login);
router.post('/refresh', requireDB, refresh);
router.post('/logout', logout);
router.get('/me', requireDB, protect, getMe);

export default router;
