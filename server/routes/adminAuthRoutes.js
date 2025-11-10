import express from 'express';
import { adminLogin, getMe, updatePassword, createAdmin } from '../controllers/adminAuthController.js';
import { authMiddleware as protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/login', adminLogin);

// Protected routes (require authentication and admin role)
router.use(protect, restrictTo('admin'));

router.get('/me', getMe);
router.patch('/update-password', updatePassword);

// Super admin only routes
router.use(restrictTo('super-admin'));
router.post('/create-admin', createAdmin);

export default router;
