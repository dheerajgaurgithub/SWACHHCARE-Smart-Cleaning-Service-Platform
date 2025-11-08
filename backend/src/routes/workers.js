const express = require('express');
const workerController = require('../controllers/workerController');
const authController = require('../controllers/authController');

const router = express.Router();

// Apply to become a worker (protected route)
router.post('/apply', authController.protect, workerController.applyAsWorker);

// Protected routes - require authentication
router.use(authController.protect);

// Worker profile routes
router.get('/me', workerController.getWorkerProfile);
router.patch('/update-profile', workerController.updateWorkerProfile);

// Availability routes
router.patch('/availability', workerController.updateAvailability);

// Location routes
router.patch('/location', workerController.updateLocation);
router.patch('/online-status', workerController.toggleOnlineStatus);

// Job management routes
router.get('/upcoming-jobs', workerController.getUpcomingJobs);
router.get('/completed-jobs', workerController.getCompletedJobs);
router.patch('/jobs/:bookingId/status', workerController.updateJobStatus);

// Earnings and payments
router.get('/earnings', workerController.getEarnings);
router.post('/withdraw', workerController.requestWithdrawal);

// Ratings and reviews
router.get('/reviews', workerController.getRatingsAndReviews);

// Admin routes - restricted to admin only
router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(workerController.getAllWorkers);

router
  .route('/:id')
  .get(workerController.getWorkerDetails)
  .patch(workerController.updateWorkerStatus);

module.exports = router;
