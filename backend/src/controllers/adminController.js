const User = require('../models/User');
const Worker = require('../models/Worker');
const Service = require('../models/Service');
const Booking = require('../models/Booking');
const Transaction = require('../models/Transaction');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');

// Admin Dashboard
// Get dashboard statistics
exports.getDashboardStats = catchAsync(async (req, res, next) => {
  const stats = await Promise.all([
    User.countDocuments(),
    Worker.countDocuments(),
    Booking.countDocuments(),
    Service.countDocuments(),
    Transaction.aggregate([
      {
        $match: { status: 'completed' }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ])
  ]);

  const [userCount, workerCount, bookingCount, serviceCount, revenueData] = stats;
  
  res.status(200).json({
    status: 'success',
    data: {
      stats: {
        users: userCount,
        workers: workerCount,
        bookings: bookingCount,
        services: serviceCount,
        revenue: revenueData[0]?.totalRevenue || 0,
        totalTransactions: revenueData[0]?.count || 0
      }
    }
  });
});

// User Management
// Get single user
exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-__v -passwordChangedAt');
  
  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

// Update user
exports.updateUser = catchAsync(async (req, res, next) => {
  const { name, email, role, active } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { name, email, role, active },
    { new: true, runValidators: true }
  );
  
  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

// Delete user
exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  
  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }
  
  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Worker Management
// Approve worker
exports.approveWorker = catchAsync(async (req, res, next) => {
  const worker = await Worker.findByIdAndUpdate(
    req.params.id,
    { status: 'approved', isActive: true },
    { new: true, runValidators: true }
  );
  
  if (!worker) {
    return next(new AppError('No worker found with that ID', 404));
  }
  
  // TODO: Send approval email to worker
  
  res.status(200).json({
    status: 'success',
    data: {
      worker
    }
  });
});

// Reject worker
exports.rejectWorker = catchAsync(async (req, res, next) => {
  const worker = await Worker.findByIdAndUpdate(
    req.params.id,
    { status: 'rejected', isActive: false },
    { new: true, runValidators: true }
  );
  
  if (!worker) {
    return next(new AppError('No worker found with that ID', 404));
  }
  
  // TODO: Send rejection email to worker
  
  res.status(200).json({
    status: 'success',
    data: {
      worker
    }
  });
});

// Service Management
// Create service
exports.createService = catchAsync(async (req, res, next) => {
  const service = await Service.create(req.body);
  
  res.status(201).json({
    status: 'success',
    data: {
      service
    }
  });
});

// Update service
exports.updateService = catchAsync(async (req, res, next) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  if (!service) {
    return next(new AppError('No service found with that ID', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      service
    }
  });
});

// Delete service
exports.deleteService = catchAsync(async (req, res, next) => {
  const service = await Service.findByIdAndDelete(req.params.id);
  
  if (!service) {
    return next(new AppError('No service found with that ID', 404));
  }
  
  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Booking Management
// Assign worker to booking
exports.assignWorkerToBooking = catchAsync(async (req, res, next) => {
  const { workerId } = req.body;
  
  // Check if worker exists and is available
  const worker = await Worker.findOne({ 
    _id: workerId, 
    status: 'approved',
    isAvailable: true 
  });
  
  if (!worker) {
    return next(new AppError('No available worker found with that ID', 400));
  }
  
  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    { 
      worker: workerId,
      status: 'confirmed',
      assignedAt: Date.now()
    },
    { new: true, runValidators: true }
  );
  
  if (!booking) {
    return next(new AppError('No booking found with that ID', 404));
  }
  
  // TODO: Send notification to worker and user
  
  res.status(200).json({
    status: 'success',
    data: {
      booking
    }
  });
});

// Transaction Management
// Get all transactions
exports.getAllTransactions = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Transaction.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
    
  const transactions = await features.query;
  
  res.status(200).json({
    status: 'success',
    results: transactions.length,
    data: {
      transactions
    }
  });
});

// Get transaction summary
exports.getTransactionSummary = catchAsync(async (req, res, next) => {
  const summary = await Transaction.aggregate([
    {
      $match: { status: 'completed' }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
        },
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);
  
  res.status(200).json({
    status: 'success',
    data: {
      summary
    }
  });
});

// System Settings
// Get settings
exports.getSettings = catchAsync(async (req, res, next) => {
  // In a real app, you would get these from a settings collection in the database
  const settings = {
    siteName: 'SwachhCare',
    contactEmail: 'support@swachhcare.com',
    supportPhone: '+911234567890',
    commissionRate: 15, // percentage
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    maintenanceMode: false,
    bookingWindowDays: 30,
    cancellationWindowHours: 2
  };
  
  res.status(200).json({
    status: 'success',
    data: {
      settings
    }
  });
});

// Update settings
exports.updateSettings = catchAsync(async (req, res, next) => {
  // In a real app, you would update these in a settings collection in the database
  const updatedSettings = {
    ...req.body,
    updatedAt: Date.now()
  };
  
  res.status(200).json({
    status: 'success',
    data: {
      settings: updatedSettings
    }
  });
});
