const express = require('express');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

// Get available time slots (public)
router.get('/available-slots', bookingController.getAvailableSlots);

// Create a new booking
router.post('/', bookingController.createBooking);

// Get all bookings (with filtering)
router.get('/', bookingController.getAllBookings);

// Get booking stats (admin only)
router.get('/stats', authController.restrictTo('admin'), bookingController.getBookingStats);

// Verify Razorpay payment (client-side verification)
router.post('/verify-razorpay-payment', bookingController.verifyRazorpayPayment);

// Webhook for Razorpay payments (server-side verification)
router.post('/razorpay-webhook', express.raw({ type: 'application/json' }), bookingController.razorpayWebhook);

// Routes for a specific booking
router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBookingStatus);

// Cancel a booking
router.post('/:id/cancel', bookingController.cancelBooking);

// Rate a completed booking
router.post('/:id/rate', bookingController.rateBooking);

module.exports = router;
