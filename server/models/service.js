import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Service description is required']
  },
  category: {
    type: String,
    required: [true, 'Service category is required'],
    enum: ['Cleaning', 'Laundry', 'Car Wash', 'Other']
  },
  price: {
    type: Number,
    required: [true, 'Service price is required'],
    min: [0, 'Price cannot be negative']
  },
  duration: {
    type: Number, // in minutes
    required: [true, 'Service duration is required'],
    min: [15, 'Minimum duration is 15 minutes']
  },
  image: {
    type: String,
    default: 'default-service.jpg'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  features: [{
    type: String,
    trim: true
  }],
  requirements: [{
    type: String,
    trim: true
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
serviceSchema.index({ name: 'text', description: 'text', category: 'text' });

// Virtual for service URL
serviceSchema.virtual('url').get(function() {
  return `/services/${this._id}`;
});

// Update the updatedAt field before saving
serviceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Query middleware to filter out inactive services by default
serviceSchema.pre(/^find/, function(next) {
  if (this.getOptions().hideInactive !== false) {
    this.find({ isActive: true });
  }
  next();
});

const Service = mongoose.model('Service', serviceSchema);

export default Service;
