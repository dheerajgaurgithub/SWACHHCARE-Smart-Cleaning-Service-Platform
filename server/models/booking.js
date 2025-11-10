import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: [true, 'Customer is required']
  },
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker',
    default: null
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: [true, 'Service is required']
  },
  date: {
    type: Date,
    required: [true, 'Booking date is required']
  },
  startTime: {
    type: String,
    required: [true, 'Start time is required']
  },
  endTime: {
    type: String,
    required: [true, 'End time is required']
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    landmark: String,
    fullAddress: String
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'assigned', 'in-progress', 'completed', 'cancelled', 'rejected'],
    default: 'pending'
  },
  payment: {
    amount: {
      type: Number,
      required: [true, 'Payment amount is required']
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded', 'partially-refunded'],
      default: 'pending'
    },
    method: {
      type: String,
      enum: ['cash', 'card', 'upi', 'wallet', 'netbanking'],
      default: 'cash'
    },
    transactionId: String,
    paymentDate: Date
  },
  specialInstructions: String,
  cancellationReason: String,
  cancellationDate: Date,
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  review: String,
  reviewDate: Date,
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
bookingSchema.index({ customer: 1 });
bookingSchema.index({ worker: 1 });
bookingSchema.index({ service: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ date: 1 });

// Virtual for booking duration
bookingSchema.virtual('duration').get(function() {
  // Calculate duration in hours
  const start = new Date(`2000-01-01T${this.startTime}`);
  const end = new Date(`2000-01-01T${this.endTime}`);
  return (end - start) / (1000 * 60 * 60); // Convert to hours
});

// Update the updatedAt field before saving
bookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Middleware to populate customer and service data when querying
const populateBooking = function(next) {
  this.populate('customer', 'fullName email phone')
      .populate('worker', 'fullName phone')
      .populate('service', 'name price duration');
  next();
};

bookingSchema.pre('find', populateBooking);
bookingSchema.pre('findOne', populateBooking);

// Static method to check worker availability
bookingSchema.statics.isWorkerAvailable = async function(workerId, date, startTime, endTime, excludeBookingId = null) {
  const query = {
    worker: workerId,
    date: date,
    status: { $in: ['confirmed', 'assigned', 'in-progress'] },
    $or: [
      { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
      { startTime: { $gte: startTime, $lt: endTime } },
      { endTime: { $gt: startTime, $lte: endTime } }
    ]
  };

  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const existingBooking = await this.findOne(query);
  return !existingBooking;
};

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
