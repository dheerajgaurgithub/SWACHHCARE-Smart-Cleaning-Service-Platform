const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Booking must belong to a user']
    },
    service: {
      type: mongoose.Schema.ObjectId,
      ref: 'Service',
      required: [true, 'Booking must be for a service']
    },
    worker: {
      type: mongoose.Schema.ObjectId,
      ref: 'Worker',
      required: [true, 'Booking must be assigned to a worker']
    },
    date: {
      type: Date,
      required: [true, 'Booking must have a date']
    },
    time: {
      type: String,
      required: [true, 'Booking must have a time']
    },
    endTime: {
      type: String,
      required: [true, 'Booking must have an end time']
    },
    address: {
      type: {
        street: String,
        city: String,
        state: String,
        pincode: String,
        location: {
          type: {
            type: String,
            default: 'Point',
            enum: ['Point']
          },
          coordinates: [Number],
          address: String,
          description: String
        }
      },
      required: [true, 'Please provide a delivery address']
    },
    status: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'in_progress',
        'completed',
        'cancelled',
        'failed',
        'refunded'
      ],
      default: 'pending'
    },
    statusHistory: [
      {
        status: String,
        changedBy: {
          type: mongoose.Schema.ObjectId,
          ref: 'User'
        },
        timestamp: {
          type: Date,
          default: Date.now()
        },
        notes: String
      }
    ],
    price: {
      type: Number,
      required: [true, 'Booking must have a price']
    },
    discount: {
      type: Number,
      default: 0
    },
    totalPrice: {
      type: Number,
      required: [true, 'Booking must have a total price']
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'wallet', 'cod', 'net_banking', 'upi'],
      required: [true, 'Please provide a payment method']
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded', 'partially_refunded'],
      default: 'pending'
    },
    paymentIntentId: String,
    paymentReceipt: String,
    couponCode: String,
    specialInstructions: String,
    workerEarnings: {
      type: Number,
      default: 0
    },
    adminCommission: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    review: String,
    reviewedAt: Date,
    cancellationReason: String,
    cancelledBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    cancelledAt: Date,
    completedAt: Date,
    createdAt: {
      type: Date,
      default: Date.now()
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for better query performance
bookingSchema.index({ user: 1 });
bookingSchema.index({ worker: 1 });
bookingSchema.index({ service: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ date: 1, time: 1 });
bookingSchema.index({ 'address.location': '2dsphere' });

// Populate user and service when querying bookings
bookingSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name email phone'
  })
  .populate({
    path: 'service',
    select: 'name price duration'
  })
  .populate({
    path: 'worker',
    select: 'userId',
    populate: {
      path: 'userId',
      select: 'name phone'
    }
  });
  next();
});

// Calculate total price before saving
bookingSchema.pre('save', function(next) {
  if (this.isModified('price') || this.isModified('discount')) {
    this.totalPrice = this.price - this.discount;
  }
  next();
});

// Add status to history when status changes
bookingSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      changedBy: this.cancelledBy || this.user,
      notes: this.status === 'cancelled' ? this.cancellationReason : ''
    });
  }
  next();
});

// Calculate worker earnings (80% of total price)
bookingSchema.methods.calculateWorkerEarnings = function() {
  this.workerEarnings = this.totalPrice * 0.8;
  this.adminCommission = this.totalPrice * 0.2;
};

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
