const express = require('express');
const adminController = require('../controllers/adminController');
const authController = require('../controllers/authController');
const bookingRouter = require('./bookings');
const userRouter = require('./users');
const workerRouter = require('./workers');
const serviceRouter = require('./services');
const transactionRouter = require('./transactions');

const router = express.Router();

// Protect all routes after this middleware - only admins can access these routes
router.use(authController.protect, authController.restrictTo('admin'));

// Nested routes
router.use('/bookings', bookingRouter);
router.use('/users', userRouter);
router.use('/workers', workerRouter);
router.use('/services', serviceRouter);
router.use('/transactions', transactionRouter);

// Admin dashboard stats
router.get('/stats', adminController.getDashboardStats);

// User management
router.route('/users/:id')
  .get(adminController.getUser)
  .patch(adminController.updateUser)
  .delete(adminController.deleteUser);

// Worker management
router.route('/workers/:id/approve')
  .patch(adminController.approveWorker);

router.route('/workers/:id/reject')
  .patch(adminController.rejectWorker);

// Service management
router.route('/services')
  .post(adminController.createService);

router.route('/services/:id')
  .patch(adminController.updateService)
  .delete(adminController.deleteService);

// Booking management
router.route('/bookings/:id/assign-worker')
  .patch(adminController.assignWorkerToBooking);

// Transaction management
router.get('/transactions', adminController.getAllTransactions);
router.get('/transactions/summary', adminController.getTransactionSummary);

// System settings
router.route('/settings')
  .get(adminController.getSettings)
  .patch(adminController.updateSettings);

module.exports = router;
