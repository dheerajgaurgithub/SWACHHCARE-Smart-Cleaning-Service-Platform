import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
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
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    default: null
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  currency: {
    type: String,
    default: 'INR',
    enum: ['INR', 'USD', 'EUR']
  },
  paymentMethod: {
    type: String,
    required: [true, 'Payment method is required'],
    enum: ['credit_card', 'debit_card', 'upi', 'netbanking', 'wallet', 'cash', 'other']
  },
  paymentProvider: {
    type: String,
    enum: ['razorpay', 'stripe', 'paypal', 'paytm', 'cash', 'other'],
    default: 'razorpay'
  },
  status: {
    type: String,
    required: [true, 'Payment status is required'],
    enum: ['created', 'pending', 'captured', 'failed', 'refunded', 'partially_refunded'],
    default: 'created'
  },
  paymentId: {
    type: String,
    required: [true, 'Payment ID is required']
  },
  orderId: String,
  invoiceId: String,
  description: String,
  receipt: String,
  refundStatus: {
    type: String,
    enum: [null, 'pending', 'processed', 'failed'],
    default: null
  },
  refundedAmount: {
    type: Number,
    default: 0
  },
  refundedAt: Date,
  refundId: String,
  metadata: {
    type: Map,
    of: String
  },
  paymentDetails: {
    card: {
      id: String,
      last4: String,
      network: String,
      issuer: String,
      emi: Boolean,
      type: String // credit or debit
    },
    upi: {
      vpa: String
    },
    bank: {
      name: String,
      ifsc: String,
      account: String
    }
  },
  capturedAt: Date,
  failedAt: Date,
  failureCode: String,
  failureDescription: String,
  email: String,
  contact: String,
  fee: Number,
  tax: Number,
  amountRefunded: {
    type: Number,
    default: 0
  },
  notes: [{
    key: String,
    value: String
  }],
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
paymentSchema.index({ user: 1, userModel: 1 });
paymentSchema.index({ booking: 1 });
paymentSchema.index({ paymentId: 1 }, { unique: true });
paymentSchema.index({ orderId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: -1 });

// Virtual for formatted amount
paymentSchema.virtual('formattedAmount').get(function() {
  return (this.amount / 100).toFixed(2);
});

// Virtual for isRefunded
paymentSchema.virtual('isRefunded').get(function() {
  return this.status === 'refunded' || this.status === 'partially_refunded';
});

// Update the updatedAt field before saving
paymentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Middleware to update related booking when payment is captured
paymentSchema.post('save', async function(doc) {
  if (doc.booking && doc.status === 'captured') {
    const Booking = mongoose.model('Booking');
    await Booking.findByIdAndUpdate(doc.booking, { 
      'payment.status': 'paid',
      'payment.paymentDate': new Date(),
      'payment.transactionId': doc.paymentId
    });
  }
});

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
