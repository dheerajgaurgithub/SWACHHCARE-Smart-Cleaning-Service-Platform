import express from 'express';
import passport from 'passport';
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  updateMe,
  deleteMe,
  getMe,
  verifyEmail,
  requestEmailUpdate,
  confirmEmailUpdate,
  requestPhoneUpdate,
  confirmPhoneUpdate,
  verifyPhone,
  resendPhoneVerification,
  googleAuthCallback,
  googleAuthSuccess,
  googleAuthFailure
} from '../controllers/authController.js';
import { authMiddleware as protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);
router.get('/verify-email/:token', verifyEmail);

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
  })
);

router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/api/auth/google/failure',
    session: false
  }),
  googleAuthCallback
);

router.get('/google/success', googleAuthSuccess);
router.get('/google/failure', googleAuthFailure);

// Protected routes (require authentication)
router.use(protect);

// User profile management
router.get('/me', getMe);
router.patch('/update-me', updateMe);
router.delete('/delete-me', deleteMe);

// Password management
router.patch('/update-password', updatePassword);

// Email management
router.post('/request-email-update', requestEmailUpdate);
router.get('/confirm-email-update/:token', confirmEmailUpdate);

// Phone management
router.post('/request-phone-update', requestPhoneUpdate);
router.post('/confirm-phone-update', confirmPhoneUpdate);
router.post('/verify-phone', verifyPhone);
router.post('/resend-phone-verification', resendPhoneVerification);

export default router;
