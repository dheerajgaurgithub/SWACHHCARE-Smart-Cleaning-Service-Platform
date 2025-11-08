const express = require('express');
const paymentController = require('../controllers/paymentController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

// Create a new payment order
router.post('/create-order', paymentController.createOrder);

// Verify payment
router.post('/verify', paymentController.verifyPayment);

// Get payment details
router.get('/:paymentId', paymentController.getPaymentDetails);

// Process refund (Admin only)
router.post('/refund', authController.restrictTo('admin'), paymentController.processRefund);

// Webhook endpoint (no authentication needed as it's called by Razorpay)
router.post('/webhook', 
  express.raw({ type: 'application/json' }), // Parse raw body for webhook
  paymentController.handleWebhook
);

module.exports = router;
