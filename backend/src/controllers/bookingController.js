const Booking = require('../models/Booking');
const User = require('../models/User');
const Worker = require('../models/Worker');
const Service = require('../models/Service');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
const { v4: uuidv4 } = require('uuid');
const { createOrder, verifyPayment } = require('../services/razorpayService');
const crypto = require('crypto');

// Helper function to calculate booking end time
const calculateEndTime = (startTime, duration) => {
  const [hours, minutes] = startTime.split(':').map(Number);
  const startDate = new Date();
  startDate.setHours(hours, minutes, 0, 0);
  
  // Add duration in minutes
  const endDate = new Date(startDate.getTime() + duration * 60000);
  
  // Format as HH:MM
  return `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`;
};

// Create a new booking
exports.createBooking = catchAsync(async (req, res, next) => {
  const { serviceId, workerId, date, time, address, paymentMethod, couponCode } = req.body;
  const userId = req.user.id;

  // 1) Get service details
  const service = await Service.findById(serviceId);
  if (!service) {
    return next(new AppError('No service found with that ID', 404));
  }

  // 2) Check if worker is available (if specific worker is selected)
  if (workerId) {
    const worker = await Worker.findById(workerId);
    if (!worker || worker.status !== 'approved' || !worker.isAvailable) {
      return next(new AppError('Selected worker is not available', 400));
    }
  }

  // 3) Calculate price and apply any discounts
  let totalPrice = service.price;
  let discount = 0;
  let discountCode = null;

  // Apply coupon if provided
  if (couponCode) {
    // In a real app, you would validate the coupon here
    // For now, we'll apply a 10% discount as an example
    discount = totalPrice * 0.1; // 10% discount
    totalPrice -= discount;
    discountCode = couponCode;
  }

  // Calculate end time
  const endTime = calculateEndTime(time, service.duration);

  // 4) Create booking
  const booking = await Booking.create({
    user: userId,
    service: serviceId,
    worker: workerId || null, // Can be null for auto-assignment
    date,
    time,
    endTime,
    address,
    status: 'pending_payment',
    price: service.price,
    discount,
    totalPrice,
    paymentMethod,
    couponCode: discountCode,
  });

  // 5) Process payment
  if (paymentMethod === 'wallet') {
    // Deduct from user's wallet
    const user = await User.findById(userId);
    
    if (user.walletBalance < totalPrice) {
      return next(new AppError('Insufficient wallet balance', 400));
    }

    user.walletBalance -= totalPrice;
    user.transactions.push({
      amount: -totalPrice,
      type: 'booking_payment',
      booking: booking._id,
    });
    await user.save({ validateBeforeSave: false });

    // Update booking status
    booking.status = 'confirmed';
    booking.paymentStatus = 'paid';
    await booking.save();

    // In a real app, you would assign a worker here or notify available workers
  } else if (paymentMethod === 'card') {
    // Create a Razorpay order for payment
    const order = await createOrder(
      totalPrice * 100, // Convert to paise
      'INR',
      {
        bookingId: booking._id.toString(),
        userId: userId,
        serviceId: serviceId
      }
    );

    // Save Razorpay order ID to booking
    booking.razorpayOrderId = order.id;
    await booking.save();

    // Send order details to the client
    return res.status(200).json({
      status: 'success',
      data: {
        booking,
        order,
        key: process.env.RAZORPAY_KEY_ID
      },
    });
  }

  res.status(201).json({
    status: 'success',
    data: {
      booking,
    },
  });
});

// Get all bookings (with filtering)
exports.getAllBookings = catchAsync(async (req, res, next) => {
  // 1) Build query
  let filter = {};
  
  // For workers, only show their assigned bookings
  if (req.user.role === 'worker') {
    filter.worker = req.user.id;
  } 
  // For customers, only show their own bookings
  else if (req.user.role === 'customer') {
    filter.user = req.user.id;
  }

  // Apply filters from query params
  if (req.query.status) {
    filter.status = req.query.status;
  }
  if (req.query.date) {
    filter.date = req.query.date;
  }
  if (req.query.service) {
    filter.service = req.query.service;
  }

  // 2) Execute query with pagination, sorting, etc.
  const features = new APIFeatures(
    Booking.find(filter)
      .populate('user', 'name email phone')
      .populate('worker', 'name phone')
      .populate('service', 'name price duration')
      .sort('-createdAt'),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const bookings = await features.query;
  const total = await Booking.countDocuments(features.queryString);

  // 3) Send response
  res.status(200).json({
    status: 'success',
    results: bookings.length,
    total,
    data: {
      bookings,
    },
  });
});

// Get a single booking
exports.getBooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id)
    .populate('user', 'name email phone')
    .populate('worker', 'name phone rating')
    .populate('service', 'name description price duration');

  if (!booking) {
    return next(new AppError('No booking found with that ID', 404));
  }

  // Check if user has permission to view this booking
  if (
    req.user.role === 'customer' &&
    booking.user._id.toString() !== req.user.id
  ) {
    return next(
      new AppError('You do not have permission to view this booking', 403)
    );
  }

  // For workers, they can only see their assigned bookings
  if (
    req.user.role === 'worker' &&
    booking.worker._id.toString() !== req.user.id
  ) {
    return next(
      new AppError('You do not have permission to view this booking', 403)
    );
  }

  res.status(200).json({
    status: 'success',
    data: {
      booking,
    },
  });
});

// Update booking status
exports.updateBookingStatus = catchAsync(async (req, res, next) => {
  const { status, notes } = req.body;
  
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    return next(new AppError('No booking found with that ID', 404));
  }

  // Check permissions
  if (
    req.user.role === 'customer' &&
    booking.user.toString() !== req.user.id
  ) {
    return next(
      new AppError('You do not have permission to update this booking', 403)
    );
  }

  // For workers, they can only update to in_progress or completed
  if (req.user.role === 'worker') {
    if (!['in_progress', 'completed'].includes(status)) {
      return next(
        new AppError('You can only update status to in_progress or completed', 403)
      );
    }
  }

  // Update status
  const previousStatus = booking.status;
  booking.status = status;
  
  // Add status update to history
  booking.statusHistory.push({
    status,
    changedBy: req.user.id,
    notes,
    timestamp: new Date(),
  });

  // Handle status-specific logic
  if (status === 'completed') {
    booking.completedAt = Date.now();
    
    // If worker is assigned, update their earnings
    if (booking.worker) {
      const worker = await Worker.findById(booking.worker);
      if (worker) {
        // Calculate worker's earnings (80% of total price as an example)
        const workerEarnings = booking.totalPrice * 0.8;
        
        worker.earnings.availableBalance += workerEarnings;
        worker.earnings.lifetimeEarnings += workerEarnings;
        worker.completedJobs += 1;
        
        // Add to worker's transactions
        worker.transactions.push({
          type: 'booking_earning',
          amount: workerEarnings,
          booking: booking._id,
          status: 'completed',
        });
        
        await worker.save({ validateBeforeSave: false });
        
        // Update booking with worker's earnings
        booking.workerEarnings = workerEarnings;
      }
    }
  } else if (status === 'cancelled') {
    // Handle cancellation logic (refunds, etc.)
    if (previousStatus === 'confirmed' || previousStatus === 'pending') {
      // Process refund if payment was made
      if (booking.paymentStatus === 'paid') {
        // Refund to wallet or original payment method
        if (booking.paymentMethod === 'wallet') {
          const user = await User.findById(booking.user);
          user.walletBalance += booking.totalPrice;
          user.transactions.push({
            amount: booking.totalPrice,
            type: 'refund',
            booking: booking._id,
            status: 'completed',
          });
          await user.save({ validateBeforeSave: false });
        } else if (booking.razorpayOrderId) {
          // Refund via Razorpay
          // await razorpay.refunds.create({
          //   payment_intent: booking.razorpayOrderId,
          // });
        }
        
        booking.paymentStatus = 'refunded';
      }
      
      // Notify worker if assigned
      if (booking.worker) {
        // In a real app, send a notification to the worker
      }
    }
  }

  await booking.save();

  res.status(200).json({
    status: 'success',
    data: {
      booking,
    },
  });
});

// Cancel a booking
exports.cancelBooking = catchAsync(async (req, res, next) => {
  const { reason } = req.body;
  
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    return next(new AppError('No booking found with that ID', 404));
  }

  // Check if user has permission to cancel this booking
  if (
    req.user.role === 'customer' &&
    booking.user.toString() !== req.user.id
  ) {
    return next(
      new AppError('You do not have permission to cancel this booking', 403)
    );
  }

  // Check if booking can be cancelled
  if (!['pending', 'confirmed'].includes(booking.status)) {
    return next(
      new AppError(
        `Booking cannot be cancelled in its current state (${booking.status})`,
        400
      )
    );
  }

  // Update status to cancelled
  booking.status = 'cancelled';
  booking.cancellationReason = reason;
  booking.cancelledAt = Date.now();
  booking.cancelledBy = req.user.id;
  
  // Add status update to history
  booking.statusHistory.push({
    status: 'cancelled',
    changedBy: req.user.id,
    notes: reason,
    timestamp: new Date(),
  });

  // Process refund if payment was made
  if (booking.paymentStatus === 'paid') {
    // Refund to wallet or original payment method
    if (booking.paymentMethod === 'wallet') {
      const user = await User.findById(booking.user);
      user.walletBalance += booking.totalPrice;
      user.transactions.push({
        amount: booking.totalPrice,
        type: 'refund',
        booking: booking._id,
        status: 'completed',
      });
      await user.save({ validateBeforeSave: false });
    } else if (booking.razorpayOrderId) {
      // Refund via Razorpay
      // await razorpay.refunds.create({
      //   payment_intent: booking.razorpayOrderId,
      // });
    }
    
    booking.paymentStatus = 'refunded';
  }

  await booking.save();

  // Notify worker if assigned
  if (booking.worker) {
    // In a real app, send a notification to the worker
  }

  res.status(200).json({
    status: 'success',
    message: 'Booking cancelled successfully',
    data: {
      booking,
    },
  });
});

// Rate a completed booking
exports.rateBooking = catchAsync(async (req, res, next) => {
  const { rating, review } = req.body;
  
  if (rating < 1 || rating > 5) {
    return next(new AppError('Rating must be between 1 and 5', 400));
  }

  const booking = await Booking.findOne({
    _id: req.params.id,
    user: req.user.id,
    status: 'completed',
  });

  if (!booking) {
    return next(
      new AppError('No completed booking found with that ID', 404)
    );
  }

  // Check if already rated
  if (booking.rating) {
    return next(new AppError('You have already rated this booking', 400));
  }

  // Update booking with rating and review
  booking.rating = rating;
  booking.review = review;
  booking.reviewedAt = Date.now();
  await booking.save();

  // Update worker's rating if assigned
  if (booking.worker) {
    const worker = await Worker.findById(booking.worker);
    if (worker) {
      // Recalculate average rating
      const bookings = await Booking.find({
        worker: booking.worker,
        rating: { $exists: true },
      });
      
      const totalRatings = bookings.reduce((sum, b) => sum + b.rating, 0);
      worker.rating = totalRatings / bookings.length;
      worker.totalRatings = bookings.length;
      
      await worker.save({ validateBeforeSave: false });
    }
  }

  // Update service rating if applicable
  if (booking.service) {
    const service = await Service.findById(booking.service);
    if (service) {
      const serviceBookings = await Booking.find({
        service: booking.service,
        rating: { $exists: true },
      });
      
      const totalRatings = serviceBookings.reduce((sum, b) => sum + b.rating, 0);
      service.rating = totalRatings / serviceBookings.length;
      service.totalRatings = serviceBookings.length;
      
      await service.save({ validateBeforeSave: false });
    }
  }

  res.status(200).json({
    status: 'success',
    message: 'Thank you for your feedback!',
    data: {
      booking,
    },
  });
});

// Verify Razorpay payment
// This endpoint should be called from the frontend after successful payment
// to verify the payment and update the booking status
exports.verifyRazorpayPayment = catchAsync(async (req, res, next) => {
  const { orderId, paymentId, signature } = req.body;
  
  if (!orderId || !paymentId || !signature) {
    return next(new AppError('Missing required payment details', 400));
  }

  // Find the booking by Razorpay order ID
  const booking = await Booking.findOne({ razorpayOrderId: orderId });
  if (!booking) {
    return next(new AppError('No booking found for this payment', 404));
  }

  // Return a 200 response to acknowledge receipt of the event
  res.status(200).json({ received: true });
});

// Get available time slots for a service and date
exports.getAvailableSlots = catchAsync(async (req, res, next) => {
  const { serviceId, date } = req.query;
  
  if (!serviceId || !date) {
    return next(new AppError('Please provide serviceId and date', 400));
  }

  // Get service details
  const service = await Service.findById(serviceId);
  if (!service) {
    return next(new AppError('No service found with that ID', 404));
  }

  // Get all bookings for the selected date
  const bookings = await Booking.find({
    date: new Date(date),
    status: { $in: ['confirmed', 'in_progress'] },
  }).select('time service');

  // Generate available time slots (every 30 minutes from 8 AM to 8 PM)
  const slots = [];
  const startHour = 8; // 8 AM
  const endHour = 20; // 8 PM
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      const endTime = calculateEndTime(time, service.duration);
      
      // Check if this slot is available
      const isBooked = bookings.some(booking => {
        const bookingEndTime = calculateEndTime(booking.time, booking.service.duration);
        return (
          (time >= booking.time && time < bookingEndTime) ||
          (endTime > booking.time && endTime <= bookingEndTime) ||
          (time <= booking.time && endTime >= bookingEndTime)
        );
      });
      
      if (!isBooked) {
        slots.push({
          time,
          endTime,
          available: true,
        });
      } else {
        slots.push({
          time,
          endTime,
          available: false,
          reason: 'Booked',
        });
      }
    }
  }

  res.status(200).json({
    status: 'success',
    data: {
      slots,
      service: {
        name: service.name,
        duration: service.duration,
      },
    },
  });
});

// Get booking statistics
// Webhook handler for Razorpay payments
exports.razorpayWebhook = catchAsync(async (req, res, next) => {
  const razorpaySignature = req.headers['x-razorpay-signature'];
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  // Verify webhook signature
  const shasum = crypto.createHmac('sha256', webhookSecret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest('hex');

  if (digest !== razorpaySignature) {
    return res.status(400).json({ status: 'error', message: 'Invalid signature' });
  }

  const { event, payload } = req.body;
  const { payment } = payload;

  // Handle different webhook events
  switch (event) {
    case 'payment.captured':
      await handleRazorpayPaymentCaptured(payment.entity);
      break;
    case 'payment.failed':
      await handleRazorpayPaymentFailed(payment.entity);
      break;
    default:
      console.log(`Unhandled Razorpay event: ${event}`);
  }

  res.status(200).json({ status: 'success' });
});

const handleRazorpayPaymentCaptured = async (payment) => {
  // Find booking by order ID in notes or metadata
  const booking = await Booking.findOne({
    $or: [
      { razorpayOrderId: payment.order_id },
      { 'paymentDetails.orderId': payment.order_id }
    ]
  });

  if (!booking) return;

  // Update booking status
  booking.status = 'confirmed';
  booking.paymentStatus = 'paid';
  booking.paymentDetails = {
    paymentMethod: payment.method || 'card',
    transactionId: payment.id,
    orderId: payment.order_id,
    amount: payment.amount / 100, // Convert from paise to INR
    currency: payment.currency,
    status: payment.status,
    paymentGateway: 'razorpay',
    paymentDate: new Date(payment.created_at * 1000), // Convert from Unix timestamp
    ...(payment.bank && { bank: payment.bank }),
    ...(payment.card && { card: payment.card }),
  };

  await booking.save();
};

const handleRazorpayPaymentFailed = async (payment) => {
  // Find booking by order ID in notes or metadata
  const booking = await Booking.findOne({
    $or: [
      { razorpayOrderId: payment.order_id },
      { 'paymentDetails.orderId': payment.order_id }
    ]
  });

  if (!booking) return;

  // Update booking status
  booking.status = 'cancelled';
  booking.paymentStatus = 'failed';
  booking.paymentDetails = {
    paymentMethod: payment.method || 'card',
    transactionId: payment.id,
    orderId: payment.order_id,
    amount: payment.amount / 100, // Convert from paise to INR
    currency: payment.currency,
    status: 'failed',
    error: payment.error_description || 'Payment failed',
    paymentGateway: 'razorpay',
  };

  await booking.save();
};

exports.getBookingStats = catchAsync(async (req, res, next) => {
  // Only admin can access this endpoint
  if (req.user.role !== 'admin') {
    return next(new AppError('Not authorized', 403));
  }

  const stats = await Booking.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        totalBookings: { $sum: 1 },
        totalRevenue: { $sum: '$totalPrice' },
        avgRating: { $avg: '$rating' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { month: 1 },
    },
  ]);

  // Get total counts
  const totalBookings = await Booking.countDocuments();
  const totalRevenue = (await Booking.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: '$totalPrice' },
      },
    },
  ]))[0]?.total || 0;

  const totalCustomers = await User.countDocuments({ role: 'customer' });
  const totalWorkers = await Worker.countDocuments({ status: 'approved' });

  res.status(200).json({
    status: 'success',
    data: {
      stats,
      totals: {
        bookings: totalBookings,
        revenue: totalRevenue,
        customers: totalCustomers,
        workers: totalWorkers,
      },
    },
  });
});
