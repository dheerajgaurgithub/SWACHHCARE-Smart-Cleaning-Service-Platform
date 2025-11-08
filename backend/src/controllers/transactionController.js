const Transaction = require('../models/Transaction');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');

// Get all transactions for the logged-in user
exports.getUserTransactions = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Transaction.find({ user: req.user.id }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const transactions = await features.query;

  res.status(200).json({
    status: 'success',
    results: transactions.length,
    data: {
      transactions,
    },
  });
});

// Get a single transaction by ID
exports.getTransaction = catchAsync(async (req, res, next) => {
  const transaction = await Transaction.findOne({
    _id: req.params.id,
    user: req.user.role === 'admin' ? { $exists: true } : req.user.id,
  });

  if (!transaction) {
    return next(new AppError('No transaction found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      transaction,
    },
  });
});

// Get all transactions (admin only)
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
      transactions,
    },
  });
});

// Get transactions by user ID (admin only)
exports.getTransactionsByUser = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Transaction.find({ user: req.params.userId }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const transactions = await features.query;

  if (!transactions || transactions.length === 0) {
    return next(new AppError('No transactions found for this user', 404));
  }

  res.status(200).json({
    status: 'success',
    results: transactions.length,
    data: {
      transactions,
    },
  });
});

// Helper function to create a transaction record
exports.createTransaction = async (transactionData) => {
  try {
    const transaction = await Transaction.create(transactionData);
    return transaction;
  } catch (error) {
    console.error('Error creating transaction:', error);
    return null;
  }
};
