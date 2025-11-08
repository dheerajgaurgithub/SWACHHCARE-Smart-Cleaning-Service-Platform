const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Transaction must belong to a user']
    },
    amount: {
      type: Number,
      required: [true, 'Transaction must have an amount']
    },
    type: {
      type: String,
      enum: [
        'booking_payment',
        'wallet_topup',
        'wallet_withdrawal',
        'refund',
        'commission',
        'payout',
        'referral_bonus',
        'other'
      ],
      required: [true, 'Please specify the transaction type']
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded', 'cancelled'],
      default: 'pending'
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'wallet', 'net_banking', 'upi', 'cod', 'other'],
      required: [true, 'Please specify the payment method']
    },
    paymentGateway: {
      type: String,
      enum: ['stripe', 'razorpay', 'paytm', 'paypal', 'manual', 'other'],
      default: 'other'
    },
    paymentGatewayId: String,
    currency: {
      type: String,
      default: 'INR',
      enum: ['INR', 'USD', 'EUR', 'GBP']
    },
    description: String,
    metadata: {
      type: Map,
      of: String
    },
    booking: {
      type: mongoose.Schema.ObjectId,
      ref: 'Booking'
    },
    walletTransaction: {
      type: Boolean,
      default: false
    },
    walletBalanceBefore: Number,
    walletBalanceAfter: Number,
    fee: {
      type: Number,
      default: 0
    },
    tax: {
      type: Number,
      default: 0
    },
    netAmount: {
      type: Number,
      required: [true, 'Please provide the net amount']
    },
    receiptUrl: String,
    failureReason: String,
    processedAt: Date,
    refundedAt: Date,
    refundReason: String,
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    updatedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for better query performance
transactionSchema.index({ user: 1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ createdAt: -1 });
transactionSchema.index({ paymentGatewayId: 1 });

// Populate user when querying transactions
transactionSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name email phone'
  }).populate({
    path: 'booking',
    select: 'service date time status'
  });
  next();
});

// Calculate net amount before saving
transactionSchema.pre('save', function(next) {
  if (this.isModified('amount') || this.isModified('fee') || this.isModified('tax')) {
    this.netAmount = this.amount - this.fee - this.tax;
  }
  next();
});

// Static method to create a new transaction
transactionSchema.statics.createTransaction = async function(transactionData) {
  try {
    const transaction = await this.create(transactionData);
    
    // Update user's wallet balance if this is a wallet transaction
    if (transaction.walletTransaction) {
      const User = mongoose.model('User');
      await User.findByIdAndUpdate(transaction.user, {
        $inc: { walletBalance: transaction.amount }
      });
    }
    
    return transaction;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
};

// Method to update transaction status
transactionSchema.methods.updateStatus = async function(status, updatedBy) {
  this.status = status;
  this.updatedBy = updatedBy;
  
  if (status === 'completed') {
    this.processedAt = Date.now();
  } else if (status === 'refunded') {
    this.refundedAt = Date.now();
  }
  
  await this.save({ validateBeforeSave: false });
  
  // Emit real-time update if needed
  const io = require('../utils/socket').getIO();
  if (io) {
    io.to(`user_${this.user}`).emit('transaction_updated', {
      transactionId: this._id,
      status: this.status,
      updatedAt: this.updatedAt
    });
  }
  
  return this;
};

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
