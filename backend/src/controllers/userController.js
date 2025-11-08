const User = require('../models/User');
const Worker = require('../models/Worker');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');

// Helper function to filter allowed fields
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// Get current user profile
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

// Get user by ID
exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

// Update user profile
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /update-password.',
        400
      )
    );
  }

  // 2) Filtered out unwanted fields that are not allowed to be updated
  const filteredBody = filterObj(
    req.body,
    'name',
    'email',
    'phone',
    'avatar',
    'dateOfBirth',
    'gender',
    'address'
  );

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

// Delete user account
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// Get all users (Admin only)
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(User.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  
  const users = await features.query;

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

// Update user (Admin only)
exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

// Delete user (Admin only)
exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// Add or update address
exports.updateAddress = catchAsync(async (req, res, next) => {
  const { address } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $set: { address } },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

// Get user wallet details
exports.getWallet = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+walletBalance +transactions');

  res.status(200).json({
    status: 'success',
    data: {
      wallet: {
        balance: user.walletBalance,
        transactions: user.transactions,
      },
    },
  });
});

// Add money to wallet
exports.addToWallet = catchAsync(async (req, res, next) => {
  const { amount, paymentMethod } = req.body;

  if (amount <= 0) {
    return next(new AppError('Amount must be greater than 0', 400));
  }

  const user = await User.findById(req.user.id);
  user.walletBalance += amount;
  user.transactions.push({
    amount,
    type: 'credit',
    paymentMethod,
    description: 'Wallet top-up',
  });
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    data: {
      walletBalance: user.walletBalance,
    },
  });
});

// Request withdrawal from wallet
exports.requestWithdrawal = catchAsync(async (req, res, next) => {
  const { amount, bankDetails } = req.body;
  const user = await User.findById(req.user.id);

  if (amount > user.walletBalance) {
    return next(new AppError('Insufficient balance', 400));
  }

  if (amount < 100) {
    return next(new AppError('Minimum withdrawal amount is ₹100', 400));
  }

  // In a real app, you would integrate with a payment gateway here
  user.walletBalance -= amount;
  user.transactions.push({
    amount: -amount,
    type: 'debit',
    paymentMethod: 'bank_transfer',
    description: 'Withdrawal request',
    status: 'pending',
  });
  await user.save({ validateBeforeSave: false });

  // Notify admin about the withdrawal request
  // In a real app, you would send an email/notification to the admin

  res.status(200).json({
    status: 'success',
    message: 'Withdrawal request submitted successfully',
    data: {
      walletBalance: user.walletBalance,
    },
  });
});

// Get user's booking history
exports.getMyBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id })
    .populate('service')
    .populate('worker', 'name rating')
    .sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    data: {
      bookings,
    },
  });
});

// Get user's reviews
exports.getMyReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({ user: req.user.id })
    .populate('service', 'name')
    .populate('worker', 'name')
    .sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

// Toggle notification preferences
exports.updateNotificationPreferences = catchAsync(async (req, res, next) => {
  const { emailNotifications, smsNotifications, pushNotifications } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      notificationPreferences: {
        email: emailNotifications !== undefined ? emailNotifications : req.user.notificationPreferences?.email,
        sms: smsNotifications !== undefined ? smsNotifications : req.user.notificationPreferences?.sms,
        push: pushNotifications !== undefined ? pushNotifications : req.user.notificationPreferences?.push,
      },
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      user: {
        notificationPreferences: user.notificationPreferences,
      },
    },
  });
});

// Update theme preference
exports.updateThemePreference = catchAsync(async (req, res, next) => {
  const { theme } = req.body;

  if (!['light', 'dark', 'system'].includes(theme)) {
    return next(new AppError('Invalid theme preference', 400));
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { themePreference: theme },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      themePreference: user.themePreference,
    },
  });
});

// Check if email exists
exports.checkEmail = catchAsync(async (req, res, next) => {
  const { email } = req.query;
  
  if (!email) {
    return next(new AppError('Please provide an email address', 400));
  }

  const user = await User.findOne({ email });
  
  res.status(200).json({
    status: 'success',
    data: {
      exists: !!user,
    },
  });
});

// Check if phone exists
exports.checkPhone = catchAsync(async (req, res, next) => {
  const { phone } = req.query;
  
  if (!phone) {
    return next(new AppError('Please provide a phone number', 400));
  }

  const user = await User.findOne({ phone });
  
  res.status(200).json({
    status: 'success',
    data: {
      exists: !!user,
    },
  });
});

// Update FCM token for push notifications
exports.updateFcmToken = catchAsync(async (req, res, next) => {
  const { token } = req.body;
  
  if (!token) {
    return next(new AppError('Please provide a valid FCM token', 400));
  }

  await User.findByIdAndUpdate(
    req.user.id,
    { fcmToken: token },
    { new: true, runValidators: true }
  );
  
  res.status(200).json({
    status: 'success',
    message: 'FCM token updated successfully',
  });
});
