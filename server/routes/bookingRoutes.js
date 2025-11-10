import express from 'express';
import * as bookingController from '../controllers/bookingController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

// Routes for customers
router
  .route('/my-bookings')
  .get(bookingController.getMyBookings);

// Routes for workers
router.use(restrictTo('worker', 'admin'));

router
  .route('/my-assignments')
  .get(bookingController.getMyAssignments);

router
  .route('/:id/complete')
  .patch(bookingController.completeBooking);

// Admin routes
router.use(restrictTo('admin'));

router
  .route('/')
  .get(bookingController.getAllBookings);

// Public routes (with authentication)
router
  .route('/')
  .post(bookingController.createBooking);

router
  .route('/:id')
  .get(bookingController.getBooking);

router
  .route('/:id/status')
  .patch(bookingController.updateBookingStatus);

router
  .route('/:id/cancel')
  .patch(bookingController.cancelBooking);

// Nested routes for service bookings
router
  .route('/service/:serviceId/bookings')
  .get(bookingController.getAllBookings);

export default router;
