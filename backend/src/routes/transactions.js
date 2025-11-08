const express = require('express');
const transactionController = require('../controllers/transactionController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

// Get all transactions for the logged-in user
router.get('/', transactionController.getUserTransactions);

// Get transaction by ID
router.get('/:id', transactionController.getTransaction);

// Admin routes - restrict to admin only
router.use(authController.restrictTo('admin'));

// Get all transactions (admin only)
router.get('/all', transactionController.getAllTransactions);

// Get transactions by user ID (admin only)
router.get('/user/:userId', transactionController.getTransactionsByUser);

module.exports = router;
