const Worker = require('../models/Worker');
const User = require('../models/User');
const Booking = require('../models/Booking');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');

// Apply to become a worker
exports.applyAsWorker = catchAsync(async (req, res, next) => {
  // Check if user already has a worker profile
  const existingWorker = await Worker.findOne({ userId: req.user.id });
  
  if (existingWorker) {
    return next(new AppError('You have already applied as a worker', 400));
  }

  const workerData = {
    userId: req.user.id,
    ...req.body,
    status: 'pending', // Initial status
  };

  // Create worker profile
  const worker = await Worker.create(workerData);

  // Update user role to 'worker' (pending approval)
  await User.findByIdAndUpdate(req.user.id, { role: 'worker' });

  res.status(201).json({
    status: 'success',
    message: 'Application submitted successfully. Waiting for admin approval.',
    data: {
      worker,
    },
  });
});

// Get worker profile
exports.getWorkerProfile = catchAsync(async (req, res, next) => {
  const worker = await Worker.findOne({ userId: req.user.id })
    .populate('userId', 'name email phone avatar');

  if (!worker) {
    return next(new AppError('No worker profile found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      worker,
    },
  });
});

// Update worker profile
exports.updateWorkerProfile = catchAsync(async (req, res, next) => {
  const worker = await Worker.findOneAndUpdate(
    { userId: req.user.id },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!worker) {
    return next(new AppError('No worker found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      worker,
    },
  });
});

// Update worker availability
exports.updateAvailability = catchAsync(async (req, res, next) => {
  const { availability } = req.body;

  if (!availability || !Array.isArray(availability)) {
    return next(new AppError('Please provide valid availability data', 400));
  }

  const worker = await Worker.findOneAndUpdate(
    { userId: req.user.id },
    { availability },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      availability: worker.availability,
    },
  });
});

// Update worker location
exports.updateLocation = catchAsync(async (req, res, next) => {
  const { coordinates } = req.body;

  if (!coordinates || !Array.isArray(coordinates) || coordinates.length !== 2) {
    return next(new AppError('Please provide valid coordinates [longitude, latitude]', 400));
  }

  const worker = await Worker.findOneAndUpdate(
    { userId: req.user.id },
    {
      currentLocation: {
        type: 'Point',
        coordinates: [coordinates[0], coordinates[1]],
      },
      lastLocationUpdate: Date.now(),
      isOnline: true,
    },
    { new: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      location: worker.currentLocation,
      isOnline: worker.isOnline,
    },
  });
});

// Toggle worker online status
exports.toggleOnlineStatus = catchAsync(async (req, res, next) => {
  const { isOnline } = req.body;

  const worker = await Worker.findOneAndUpdate(
    { userId: req.user.id },
    { 
      isOnline,
      ...(isOnline && { lastActive: Date.now() })
    },
    { new: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      isOnline: worker.isOnline,
      lastActive: worker.lastActive,
    },
  });
});

// Get worker's upcoming jobs
exports.getUpcomingJobs = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({
    workerId: req.user.id,
    status: { $in: ['confirmed', 'in_progress'] },
    date: { $gte: new Date() },
  })
    .populate('userId', 'name phone')
    .sort('date time');

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    data: {
      bookings,
    },
  });
});

// Get worker's completed jobs
exports.getCompletedJobs = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Booking.find({
      workerId: req.user.id,
      status: 'completed',
    })
      .populate('userId', 'name')
      .sort('-completedAt'),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const bookings = await features.query;

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    data: {
      bookings,
    },
  });
});

// Update job status
exports.updateJobStatus = catchAsync(async (req, res, next) => {
  const { bookingId } = req.params;
  const { status, notes } = req.body;

  const validStatuses = ['in_progress', 'completed', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return next(new AppError('Invalid status', 400));
  }

  const booking = await Booking.findOne({
    _id: bookingId,
    workerId: req.user.id,
  });

  if (!booking) {
    return next(new AppError('No booking found with that ID', 404));
  }

  // Update status
  booking.status = status;
  
  // Add status update to history
  booking.statusHistory.push({
    status,
    changedBy: req.user.id,
    notes,
  });

  // If completed, set completedAt
  if (status === 'completed') {
    booking.completedAt = Date.now();
  }

  await booking.save();

  res.status(200).json({
    status: 'success',
    data: {
      booking,
    },
  });
});

// Get worker's earnings
exports.getEarnings = catchAsync(async (req, res, next) => {
  const worker = await Worker.findOne({ userId: req.user.id });
  
  if (!worker) {
    return next(new AppError('No worker found', 404));
  }

  // Get completed bookings count and total earnings
  const stats = await Booking.aggregate([
    {
      $match: {
        workerId: worker._id,
        status: 'completed',
      },
    },
    {
      $group: {
        _id: null,
        totalEarnings: { $sum: '$workerEarnings' },
        totalJobs: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  // Get earnings by date (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const earningsByDate = await Booking.aggregate([
    {
      $match: {
        workerId: worker._id,
        status: 'completed',
        completedAt: { $gte: thirtyDaysAgo },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$completedAt' } },
        earnings: { $sum: '$workerEarnings' },
        jobs: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      totalEarnings: stats[0]?.totalEarnings || 0,
      totalJobs: stats[0]?.totalJobs || 0,
      avgRating: stats[0]?.avgRating ? Math.round(stats[0].avgRating * 10) / 10 : 0,
      earningsByDate,
      availableBalance: worker.earnings.availableBalance,
      pendingWithdrawal: worker.earnings.pendingWithdrawal,
      lifetimeEarnings: worker.earnings.lifetimeEarnings,
    },
  });
});

// Request withdrawal
exports.requestWithdrawal = catchAsync(async (req, res, next) => {
  const { amount } = req.body;
  const worker = await Worker.findOne({ userId: req.user.id });

  if (!worker) {
    return next(new AppError('No worker found', 404));
  }

  if (amount > worker.earnings.availableBalance) {
    return next(new AppError('Insufficient balance', 400));
  }

  // In a real app, you would integrate with a payment gateway here
  worker.earnings.availableBalance -= amount;
  worker.earnings.pendingWithdrawal += amount;
  
  // Add to transactions
  worker.transactions.push({
    type: 'withdrawal_request',
    amount: -amount,
    status: 'pending',
    description: 'Withdrawal request',
  });

  await worker.save();

  // Notify admin about the withdrawal request
  // In a real app, you would send an email/notification to the admin

  res.status(200).json({
    status: 'success',
    message: 'Withdrawal request submitted successfully',
    data: {
      availableBalance: worker.earnings.availableBalance,
      pendingWithdrawal: worker.earnings.pendingWithdrawal,
    },
  });
});

// Get worker's ratings and reviews
exports.getRatingsAndReviews = catchAsync(async (req, res, next) => {
  const worker = await Worker.findOne({ userId: req.user.id });
  
  if (!worker) {
    return next(new AppError('No worker found', 404));
  }

  const reviews = await Booking.find({
    workerId: worker._id,
    rating: { $exists: true },
  })
    .populate('userId', 'name avatar')
    .sort('-completedAt');

  // Calculate average rating
  const totalRatings = reviews.reduce((sum, review) => sum + review.rating, 0);
  const avgRating = reviews.length > 0 ? totalRatings / reviews.length : 0;

  // Count ratings
  const ratingCounts = [0, 0, 0, 0, 0];
  reviews.forEach((review) => {
    ratingCounts[review.rating - 1]++;
  });

  res.status(200).json({
    status: 'success',
    data: {
      avgRating: Math.round(avgRating * 10) / 10,
      totalRatings: reviews.length,
      ratingCounts,
      reviews,
    },
  });
});

// Admin: Get all workers (with filtering and pagination)
exports.getAllWorkers = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Worker.find()
      .populate('userId', 'name email phone')
      .sort('-createdAt'),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const workers = await features.query;
  const total = await Worker.countDocuments(features.queryString);

  res.status(200).json({
    status: 'success',
    results: workers.length,
    total,
    data: {
      workers,
    },
  });
});

// Admin: Update worker status (approve/reject/suspend)
exports.updateWorkerStatus = catchAsync(async (req, res, next) => {
  const { status, rejectionReason } = req.body;
  
  if (!['approved', 'rejected', 'suspended'].includes(status)) {
    return next(new AppError('Invalid status', 400));
  }

  const worker = await Worker.findByIdAndUpdate(
    req.params.id,
    { 
      status,
      ...(status === 'rejected' && { rejectionReason }),
      ...(status === 'approved' && { approvedAt: Date.now() }),
    },
    { new: true, runValidators: true }
  );

  if (!worker) {
    return next(new AppError('No worker found with that ID', 404));
  }

  // If approved, update user role to 'worker'
  if (status === 'approved') {
    await User.findByIdAndUpdate(worker.userId, { role: 'worker' });
  }

  // Send notification to worker
  // In a real app, you would send an email/notification to the worker

  res.status(200).json({
    status: 'success',
    data: {
      worker,
    },
  });
});

// Admin: Get worker details
exports.getWorkerDetails = catchAsync(async (req, res, next) => {
  const worker = await Worker.findById(req.params.id)
    .populate('userId', 'name email phone')
    .populate({
      path: 'bookings',
      populate: {
        path: 'userId',
        select: 'name phone',
      },
    });

  if (!worker) {
    return next(new AppError('No worker found with that ID', 404));
  }

  // Get worker stats
  const stats = await Booking.aggregate([
    {
      $match: {
        workerId: worker._id,
      },
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalEarnings: { $sum: '$workerEarnings' },
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      worker,
      stats,
    },
  });
});
