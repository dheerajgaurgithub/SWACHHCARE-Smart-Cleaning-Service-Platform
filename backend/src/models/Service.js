const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A service must have a name'],
      trim: true,
      maxlength: [100, 'A service name must have less or equal than 100 characters'],
      minlength: [5, 'A service name must have more or equal than 5 characters']
    },
    slug: String,
    description: {
      type: String,
      required: [true, 'A service must have a description'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'A service must belong to a category'],
      enum: {
        values: ['cleaning', 'laundry', 'car_wash', 'disinfection', 'other'],
        message: 'Category must be either: cleaning, laundry, car_wash, disinfection, or other'
      }
    },
    subcategory: {
      type: String,
      required: [true, 'A service must have a subcategory']
    },
    price: {
      type: Number,
      required: [true, 'A service must have a price'],
      min: [0, 'Price must be above 0']
    },
    duration: {
      type: Number,
      required: [true, 'A service must have a duration'],
      min: [15, 'Duration must be at least 15 minutes']
    },
    imageCover: {
      type: String,
      default: 'default.jpg'
    },
    images: [String],
    includedServices: [
      {
        name: String,
        description: String
      }
    ],
    addOns: [
      {
        name: String,
        description: String,
        price: Number,
        duration: Number
      }
    ],
    rating: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: val => Math.round(val * 10) / 10 // 4.666666, 46.6666, 47, 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true,
      select: false
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Service must be created by an admin']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual populate
serviceSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'service',
  localField: '_id'
});

// Indexes for better query performance
serviceSchema.index({ price: 1, rating: -1 });
serviceSchema.index({ slug: 1 });
serviceSchema.index({ category: 1, subcategory: 1 });

// Query middleware to filter out inactive services by default
serviceSchema.pre(/^find/, function(next) {
  this.find({ isActive: { $ne: false } });
  next();
});

// Virtual field for average rating
serviceSchema.virtual('avgRating').get(function() {
  if (this.ratingsQuantity === 0) return 0;
  return this.ratings.reduce((sum, rating) => sum + rating, 0) / this.ratings.length;
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
