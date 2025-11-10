import Booking from '../models/booking.js';
import Service from '../models/service.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import APIFeatures from '../utils/apiFeatures.js';
import { sendEmail } from '../utils/email.js';
import { sendSMS } from '../utils/sms.js';

// @desc    Create a new booking
// @route   POST /api/v1/bookings
// @access  Private
export const createBooking = catchAsync(async (req, res, next) => {
  // 1) Get the service and check if it exists
  const service = await Service.findById(req.body.service);
  if (!service) {
    return next(new AppError('No service found with that ID', 404));
  }

  // 2) Check if service is active
  if (!service.isActive) {
    return next(new AppError('This service is currently not available', 400));
  }

  // 3) Set customer from the logged-in user
  req.body.customer = req.user.id;
  
  // 4) Set default status and calculate end time if not provided
  if (!req.body.status) req.body.status = 'pending';
  
  // 5) Create the booking
  const booking = await Booking.create(req.body);

  // 6) Send confirmation email
  try {
    const bookingUrl = `${req.protocol}://${req.get('host')}/my-bookings/${booking._id}`;
    
    await sendEmail({
      email: req.user.email,
      subject: 'Booking Confirmation',
      template: 'bookingConfirmation',
      templateVars: {
        name: req.user.fullName,
        bookingId: booking._id,
        service: service.name,
        date: booking.date.toLocaleDateString(),
        time: booking.startTime,
        amount: booking.payment.amount,
        status: booking.status,
        url: bookingUrl
      }
    });
    
    // Send SMS if phone number exists
    if (req.user.phone) {
      await sendSMS({
        to: req.user.phone,
        message: `Your booking #${booking._id} for ${service.name} on ${booking.date.toLocaleDateString()} at ${booking.startTime} has been confirmed.`
      });
    }
  } catch (err) {
    console.error('Error sending confirmation:', err);
    // Don't fail the request if email/sms sending fails
  }

  res.status(201).json({
    status: 'success',
    data: {
      booking
    }
  });
});

// @desc    Get all bookings
// @route   GET /api/v1/bookings
// @access  Private/Admin
export const getAllBookings = catchAsync(async (req, res, next) => {
  // Allow nested GET reviews on service
  let filter = {};
  if (req.params.serviceId) filter = { service: req.params.serviceId };
  
  const features = new APIFeatures(Booking.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  
  const bookings = await features.query;

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    data: {
      bookings
    }
  });
});

// @desc    Get a single booking
// @route   GET /api/v1/bookings/:id
// @access  Private
export const getBooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);
  
  // Check if booking exists and if user has permission to view it
  if (!booking) {
    return next(new AppError('No booking found with that ID', 404));
  }
  
  // Only allow the customer, assigned worker, or admin to view the booking
  if (
    booking.customer._id.toString() !== req.user.id && 
    (booking.worker && booking.worker._id.toString() !== req.user.id) &&
    req.user.role !== 'admin'
  ) {
    return next(new AppError('You are not authorized to view this booking', 403));
  }

  res.status(200).json({
    status: 'success',
    data: {
      booking
    }
  });
});

// @desc    Update booking status
// @route   PATCH /api/v1/bookings/:id/status
// @access  Private
export const updateBookingStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;
  
  const booking = await Booking.findById(req.params.id);
  
  if (!booking) {
    return next(new AppError('No booking found with that ID', 404));
  }
  
  // Check if user has permission to update this booking
  if (
    booking.customer._id.toString() !== req.user.id && 
    (booking.worker && booking.worker._id.toString() !== req.user.id) &&
    req.user.role !== 'admin'
  ) {
    return next(new AppError('You are not authorized to update this booking', 403));
  }
  
  // Update status
  booking.status = status;
  booking.updatedAt = Date.now();
  
  await booking.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    data: {
      booking
    }
  });
});

// @desc    Cancel a booking
// @route   PATCH /api/v1/bookings/:id/cancel
// @access  Private
export const cancelBooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);
  
  if (!booking) {
    return next(new AppError('No booking found with that ID', 404));
  }
  
  // Only customer or admin can cancel booking
  if (booking.customer._id.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('You are not authorized to cancel this booking', 403));
  }
  
  // Check if booking can be cancelled
  if (['cancelled', 'completed'].includes(booking.status)) {
    return next(new AppError(`Booking is already ${booking.status}`, 400));
  }
  
  // Update status to cancelled
  booking.status = 'cancelled';
  booking.cancellationReason = req.body.reason || 'Cancelled by customer';
  booking.cancellationDate = Date.now();
  
  await booking.save({ validateBeforeSave: false });
  
  // TODO: Process refund if payment was made
  
  // TODO: Notify worker if assigned
  
  // Send cancellation email
  try {
    await sendEmail({
      email: booking.customer.email,
      subject: 'Booking Cancelled',
      template: 'bookingCancellation',
      templateVars: {
        name: booking.customer.fullName,
        bookingId: booking._id,
        service: booking.service.name,
        date: booking.date.toLocaleDateString(),
        time: booking.startTime,
        reason: booking.cancellationReason
      }
    });
  } catch (err) {
    console.error('Error sending cancellation email:', err);
  }

  res.status(200).json({
    status: 'success',
    data: {
      booking
    }
  });
});

// @desc    Get bookings for logged in user
// @route   GET /api/v1/bookings/my-bookings
// @access  Private
export const getMyBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ customer: req.user.id })
    .sort('-createdAt')
    .populate('service', 'name price')
    .populate('worker', 'fullName phone');

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    data: {
      bookings
    }
  });
});

// @desc    Get bookings for assigned worker
// @route   GET /api/v1/bookings/my-assignments
// @access  Private/Worker
export const getMyAssignments = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ 
    worker: req.user.id,
    status: { $in: ['assigned', 'in-progress'] }
  })
  .sort('date startTime')
  .populate('customer', 'fullName phone address')
  .populate('service', 'name price duration');

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    data: {
      bookings
    }
  });
});

// @desc    Complete a booking (for workers)
// @route   PATCH /api/v1/bookings/:id/complete
// @access  Private/Worker
export const completeBooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);
  
  if (!booking) {
    return next(new AppError('No booking found with that ID', 404));
  }
  
  // Check if the worker is assigned to this booking
  if (booking.worker._id.toString() !== req.user.id) {
    return next(new AppError('You are not assigned to this booking', 403));
  }
  
  // Update status to completed
  booking.status = 'completed';
  booking.completedAt = Date.now();
  
  await booking.save({ validateBeforeSave: false });
  
  // TODO: Process payment to worker
  
  // Send completion email to customer
  try {
    await sendEmail({
      email: booking.customer.email,
      subject: 'Service Completed',
      template: 'serviceCompleted',
      templateVars: {
        name: booking.customer.fullName,
        bookingId: booking._id,
        service: booking.service.name,
        worker: req.user.fullName,
        ratingLink: `${req.protocol}://${req.get('host')}/bookings/${booking._id}/rate`
      }
    });
  } catch (err) {
    console.error('Error sending completion email:', err);
  }

  res.status(200).json({
    status: 'success',
    data: {
      booking
    }
  });
});

export default {
  createBooking,
  getAllBookings,
  getBooking,
  updateBookingStatus,
  cancelBooking,
  getMyBookings,
  getMyAssignments,
  completeBooking
};
