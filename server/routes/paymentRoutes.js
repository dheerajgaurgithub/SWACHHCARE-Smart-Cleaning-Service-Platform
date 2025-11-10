import express from 'express';
import * as paymentController from '../controllers/paymentController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

// Payment routes
router
  .route('/create-order')
  .post(paymentController.createPaymentOrder);

router
  .route('/verify')
  .post(paymentController.verifyPayment);

// Wallet routes
router
  .route('/wallet/topup')
  .post(paymentController.addToWallet);

router
  .route('/wallet/balance')
  .get(paymentController.getWalletBalance);

router
  .route('/wallet/transactions')
  .get(paymentController.getWalletTransactions);

// Admin routes
router.use(restrictTo('admin'));

router
  .route('/refund')
  .post(paymentController.processRefund);

export default router;
