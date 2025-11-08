const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty'],
      trim: true,
      maxlength: [500, 'A review must have less or equal than 500 characters']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'A review must have a rating']
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    service: {
      type: mongoose.Schema.ObjectId,
      ref: 'Service',
      required: [true, 'Review must belong to a service']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user']
    },
    worker: {
      type: mongoose.Schema.ObjectId,
      ref: 'Worker',
      required: [true, 'Review must be for a worker']
    },
    booking: {
      type: mongoose.Schema.ObjectId,
      ref: 'Booking',
      required: [true, 'Review must belong to a booking']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Prevent duplicate reviews from same user for same service
reviewSchema.index({ service: 1, user: 1 }, { unique: true });

// Populate user and service when querying reviews
reviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name photo'
  });
  next();
});

// Static method to calculate average ratings on a service
reviewSchema.statics.calcAverageRatings = async function(serviceId) {
  const stats = await this.aggregate([
    {
      $match: { service: serviceId }
    },
    {
      $group: {
        _id: '$service',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  if (stats.length > 0) {
    await mongoose.model('Service').findByIdAndUpdate(serviceId, {
      ratingsQuantity: stats[0].nRating,
      rating: stats[0].avgRating
    });
  } else {
    await mongoose.model('Service').findByIdAndUpdate(serviceId, {
      ratingsQuantity: 0,
      rating: 4.5
    });
  }
};

// Update service ratings after saving a review
reviewSchema.post('save', function() {
  // this points to current review
  this.constructor.calcAverageRatings(this.service);
});

// Update service ratings after updating or deleting a review
reviewSchema.post(/^findOneAnd/, async function(doc) {
  if (doc) {
    await doc.constructor.calcAverageRatings(doc.service);
  }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
