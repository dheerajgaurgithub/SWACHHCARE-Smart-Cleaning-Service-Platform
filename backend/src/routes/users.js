const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

// Public routes
router.get('/check-email', userController.checkEmail);
router.get('/check-phone', userController.checkPhone);

// Protected routes - require authentication
router.use(authController.protect);

// User profile routes
router.get('/me', userController.getMe, userController.getUser);
router.patch('/update-me', userController.updateMe);
router.delete('/delete-me', userController.deleteMe);
router.patch('/update-address', userController.updateAddress);

// Wallet routes
router.get('/wallet', userController.getWallet);
router.post('/wallet/add-money', userController.addToWallet);
router.post('/wallet/withdraw', userController.requestWithdrawal);

// Booking history
router.get('/my-bookings', userController.getMyBookings);

// Reviews
router.get('/my-reviews', userController.getMyReviews);

// Settings
router.patch('/update-notifications', userController.updateNotificationPreferences);
router.patch('/update-theme', userController.updateThemePreference);
router.post('/update-fcm-token', userController.updateFcmToken);

// Admin routes - restricted to admin only
router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
