import mongoose from 'mongoose';

const walletTransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'userModel',
    required: [true, 'User is required']
  },
  userModel: {
    type: String,
    required: [true, 'User model type is required'],
    enum: ['Customer', 'Worker']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  type: {
    type: String,
    required: [true, 'Transaction type is required'],
    enum: ['credit', 'debit']
  },
  balance: {
    type: Number,
    required: [true, 'Balance is required']
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  reference: {
    type: mongoose.Schema.Types.Mixed,
    refPath: 'referenceModel'
  },
  referenceModel: {
    type: String,
    enum: ['Payment', 'Booking', 'Refund', 'Payout', 'Promo', null],
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  metadata: {
    type: Map,
    of: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
walletTransactionSchema.index({ user: 1, userModel: 1 });
walletTransactionSchema.index({ reference: 1, referenceModel: 1 });
walletTransactionSchema.index({ status: 1 });
walletTransactionSchema.index({ createdAt: -1 });

// Update the updatedAt field before saving
walletTransactionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const WalletTransaction = mongoose.model('WalletTransaction', walletTransactionSchema);

// Wallet Schema
const walletSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'userModel',
    required: [true, 'User is required'],
    unique: true
  },
  userModel: {
    type: String,
    required: [true, 'User model type is required'],
    enum: ['Customer', 'Worker']
  },
  balance: {
    type: Number,
    required: [true, 'Balance is required'],
    default: 0,
    min: [0, 'Balance cannot be negative']
  },
  currency: {
    type: String,
    default: 'INR',
    enum: ['INR', 'USD', 'EUR']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastTransaction: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
walletSchema.index({ user: 1, userModel: 1 }, { unique: true });

// Virtual for formatted balance
walletSchema.virtual('formattedBalance').get(function() {
  return (this.balance / 100).toFixed(2);
});

// Update the updatedAt field before saving
walletSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Static method to get or create wallet
walletSchema.statics.getOrCreateWallet = async function(userId, userModel) {
  let wallet = await this.findOne({ user: userId, userModel });
  
  if (!wallet) {
    wallet = await this.create({
      user: userId,
      userModel,
      balance: 0
    });
  }
  
  return wallet;
};

// Method to add credit to wallet
walletSchema.methods.addCredit = async function(amount, description, reference = null, referenceModel = null) {
  if (amount <= 0) {
    throw new Error('Amount must be greater than zero');
  }
  
  // Create transaction
  const transaction = new WalletTransaction({
    user: this.user,
    userModel: this.userModel,
    amount,
    type: 'credit',
    balance: this.balance + amount,
    description,
    reference,
    referenceModel,
    status: 'completed'
  });
  
  // Update wallet balance
  this.balance += amount;
  this.lastTransaction = new Date();
  
  // Save both in a transaction
  const session = await mongoose.startSession();
  await session.withTransaction(async () => {
    await this.save({ session });
    await transaction.save({ session });
  });
  
  return transaction;
};

// Method to deduct from wallet
walletSchema.methods.deduct = async function(amount, description, reference = null, referenceModel = null) {
  if (amount <= 0) {
    throw new Error('Amount must be greater than zero');
  }
  
  if (this.balance < amount) {
    throw new Error('Insufficient balance');
  }
  
  // Create transaction
  const transaction = new WalletTransaction({
    user: this.user,
    userModel: this.userModel,
    amount,
    type: 'debit',
    balance: this.balance - amount,
    description,
    reference,
    referenceModel,
    status: 'completed'
  });
  
  // Update wallet balance
  this.balance -= amount;
  this.lastTransaction = new Date();
  
  // Save both in a transaction
  const session = await mongoose.startSession();
  await session.withTransaction(async () => {
    await this.save({ session });
    await transaction.save({ session });
  });
  
  return transaction;
};

// Method to get transaction history
walletSchema.methods.getTransactionHistory = function(options = {}) {
  const { page = 1, limit = 10, sort = { createdAt: -1 } } = options;
  
  return WalletTransaction.find({
    user: this.user,
    userModel: this.userModel
  })
  .sort(sort)
  .skip((page - 1) * limit)
  .limit(limit);
};

const Wallet = mongoose.model('Wallet', walletSchema);

export { Wallet, WalletTransaction };
