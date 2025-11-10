import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const workerSchema = new mongoose.Schema(
  {
    fullName: { 
      type: String, 
      required: [true, 'Full name is required'] 
    },
    email: { 
      type: String, 
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
    },
    phone: { 
      type: String, 
      required: [true, 'Phone number is required'],
      unique: true,
      match: [/^[0-9]{10}$/, 'Please use a valid 10-digit phone number']
    },
    password: { 
      type: String, 
      required: [true, 'Password is required'],
      minlength: 6,
      select: false
    },
    gender: { 
      type: String,
      enum: ['male', 'female', 'other', 'prefer-not-to-say'],
      default: 'prefer-not-to-say'
    },
    dob: { 
      type: Date,
      validate: {
        validator: function(v) {
          return v < new Date();
        },
        message: 'Date of birth must be in the past'
      }
    },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      pincode: { type: String, default: '' },
    },
    skills: [{ 
      type: String,
      enum: ['Cleaning', 'Laundry', 'Car Wash', 'Plumbing', 'Electrical', 'Carpentry', 'Painting', 'Pest Control'],
      required: [true, 'At least one skill is required']
    }],
    profilePic: { 
      type: String,
      default: 'default-worker.jpg'
    },
    documents: [{
      name: { type: String, required: true },
      url: { type: String, required: true },
      type: { type: String, enum: ['aadhar', 'pan', 'license', 'other'] },
      verified: { type: Boolean, default: false },
      uploadedAt: { type: Date, default: Date.now }
    }],
    isApproved: { 
      type: Boolean, 
      default: false 
    },
    approvedAt: Date,
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    },
    status: {
      type: String,
      enum: ["pending", "active", "inactive", "suspended", "rejected"],
      default: "pending"
    },
    rejectionReason: String,
    suspendedAt: Date,
    suspendedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    },
    suspensionReason: String,
    assignedTasks: [{
      taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        required: true
      },
      status: {
        type: String,
        enum: ["pending", "accepted", "in-progress", "completed", "cancelled", "rejected"],
        default: "pending"
      },
      acceptedAt: Date,
      startedAt: Date,
      completedAt: Date,
      customerRating: {
        type: Number,
        min: 1,
        max: 5
      },
      customerFeedback: String
    }],
    attendance: [{
      date: { 
        type: Date, 
        required: true
      },
      checkIn: { 
        type: String, // Store as 'HH:MM' format
        required: true
      },
      checkOut: { 
        type: String // Store as 'HH:MM' format
      },
      status: { 
        type: String, 
        enum: ["present", "absent", "half-day", 'on-leave'], 
        default: "present" 
      },
      notes: String,
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'attendance.createdByModel'
      },
      createdByModel: {
        type: String,
        enum: ['Worker', 'Admin']
      }
    }],
    salary: {
      basePay: { 
        type: Number, 
        default: 0 
      },
      paymentFrequency: {
        type: String,
        enum: ['weekly', 'bi-weekly', 'monthly'],
        default: 'monthly'
      },
      totalEarnings: { 
        type: Number, 
        default: 0 
      },
      lastPaidOn: { 
        type: Date 
      },
      paymentHistory: [{
        amount: {
          type: Number,
          required: true
        },
        date: {
          type: Date,
          default: Date.now
        },
        paymentMethod: {
          type: String,
          enum: ['bank-transfer', 'cash', 'upi', 'other'],
          required: true
        },
        reference: String,
        processedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Admin',
          required: true
        },
        notes: String,
        status: {
          type: String,
          enum: ['pending', 'completed', 'failed'],
          default: 'pending'
        }
      }]
    },
    bankDetails: {
      accountNumber: String,
      accountHolderName: String,
      bankName: String,
      branch: String,
      ifscCode: String,
      upiId: String
    },
    otp: {
      code: String,
      expiry: Date,
      verified: {
        type: Boolean,
        default: false
      }
    },
    googleId: String,
    fcmToken: String,
    isActive: {
      type: Boolean,
      default: true
    },
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
      },
      count: {
        type: Number,
        default: 0
      },
      reviews: [{
        customerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Customer",
          required: true
        },
        taskId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Task",
          required: true
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5
        },
        comment: String,
        date: {
          type: Date,
          default: Date.now
        }
      }]
    },
    role: {
      type: String,
      default: "worker"
    },
    preferences: {
      notifications: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: true },
        push: { type: Boolean, default: true }
      },
      preferredLocation: {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        radius: { type: Number, default: 20 } // in kilometers
      },
      preferredWorkingHours: {
        startTime: { type: String, default: '09:00' },
        endTime: { type: String, default: '18:00' }
      },
      preferredPaymentMethod: {
        type: String,
        enum: ['bank-transfer', 'upi', 'cash'],
        default: 'bank-transfer'
      }
    },
    availability: {
      type: Boolean,
      default: true
    },
    emergencyContact: {
      name: String,
      relationship: String,
      phone: String,
      address: String
    },
    notes: [{
      content: String,
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  {
    timestamps: true,
    toJSON: { 
      virtuals: true,
      transform: function(doc, ret) {
        delete ret.password;
        delete ret.otp;
        delete ret.fcmToken;
        delete ret.__v;
        return ret;
      }
    },
    toObject: { 
      virtuals: true,
      transform: function(doc, ret) {
        delete ret.password;
        delete ret.otp;
        delete ret.fcmToken;
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Indexes - Note: email and phone indexes are already defined in the schema with unique: true
workerSchema.index({ 'assignedTasks.status': 1 });
workerSchema.index({ status: 1, isApproved: 1 });
workerSchema.index({ 'preferences.preferredLocation': '2dsphere' });
workerSchema.index({ skills: 1 });
workerSchema.index({ 'rating.average': 1 });
workerSchema.index({ 'attendance.date': 1 });

// Hash password before saving
workerSchema.pre('save', async function(next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();
  
  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Update timestamps on status changes
workerSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    if (this.status === 'suspended' && this.isNew) {
      this.suspendedAt = Date.now();
    } else if (this.status === 'active' && this.isNew) {
      this.approvedAt = Date.now();
    }
  }
  next();
});

// Update average rating when a new review is added
workerSchema.pre('save', function(next) {
  if (this.isModified('rating.reviews') && this.rating.reviews.length > 0) {
    const total = this.rating.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.rating.average = total / this.rating.reviews.length;
    this.rating.count = this.rating.reviews.length;
  }
  next();
});

// Method to check if password is correct
workerSchema.methods.correctPassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to generate OTP
workerSchema.methods.createOTP = function() {
  const otp = Math.floor(100000 + Math.random() * 900000);
  this.otp = {
    code: otp.toString(),
    expiry: Date.now() + 10 * 60 * 1000, // 10 minutes
    verified: false
  };
  return otp;
};

// Method to verify OTP
workerSchema.methods.verifyOTP = function(otp) {
  if (!this.otp || this.otp.expiry < Date.now()) {
    return false;
  }
  
  const isMatch = this.otp.code === otp.toString();
  if (isMatch) {
    this.otp.verified = true;
  }
  
  return isMatch;
};

// Method to check if OTP is verified
workerSchema.methods.isOTPVerified = function() {
  return this.otp && this.otp.verified === true;
};

// Method to check if password was changed after JWT was issued
workerSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Method to create password reset token
workerSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
    
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  
  return resetToken;
};

// Method to get worker's current status
workerSchema.methods.getStatus = function() {
  if (!this.isActive) return 'inactive';
  if (this.status === 'suspended') return 'suspended';
  if (!this.isApproved) return 'pending-approval';
  return 'active';
};

// Method to check if worker is available for new tasks
workerSchema.methods.isAvailable = function() {
  if (!this.isActive || !this.isApproved || this.status !== 'active') {
    return false;
  }
  
  // Check if worker has reached daily task limit
  const today = new Date().setHours(0, 0, 0, 0);
  const tasksToday = this.assignedTasks.filter(
    task => new Date(task.date).setHours(0, 0, 0, 0) === today
  ).length;
  
  const maxDailyTasks = this.preferences?.maxDailyTasks || 5;
  return tasksToday < maxDailyTasks;
};

// Find worker by credentials (email/phone and password)
workerSchema.statics.findByCredentials = async function(identifier, password) {
  const worker = await this.findOne({
    $or: [
      { email: identifier },
      { phone: identifier }
    ]
  }).select('+password');

  if (!worker) {
    throw new Error('Invalid login credentials');
  }

  const isMatch = await worker.correctPassword(password);
  
  if (!isMatch) {
    throw new Error('Invalid login credentials');
  }

  return worker;
};

// Get workers by location within a radius (in kilometers)
workerSchema.statics.findByLocation = function(coordinates, maxDistance = 20) {
  return this.find({
    'preferences.preferredLocation': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates
        },
        $maxDistance: maxDistance * 1000 // Convert km to meters
      }
    },
    isActive: true,
    isApproved: true,
    status: 'active',
    availability: true
  });
};

// Virtual for worker's full address
workerSchema.virtual('fullAddress').get(function() {
  if (!this.address) return '';
  const { street, city, state, pincode } = this.address;
  return [street, city, state, pincode].filter(Boolean).join(', ');
});

// Virtual for worker's experience in years
workerSchema.virtual('experienceInYears').get(function() {
  if (!this.createdAt) return 0;
  const diffMs = Date.now() - this.createdAt.getTime();
  const diffDate = new Date(diffMs);
  return Math.abs(diffDate.getUTCFullYear() - 1970);
});

// Virtual for worker's current task
workerSchema.virtual('currentTask').get(function() {
  return this.assignedTasks.find(
    task => ['pending', 'accepted', 'in-progress'].includes(task.status)
  );
});

// Filter out inactive workers by default
workerSchema.pre(/^find/, function(next) {
  this.find({ isActive: { $ne: false } });
  next();
});

// Populate approvedBy field for admin actions
workerSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'approvedBy suspendedBy',
    select: 'fullName email'
  });
  next();
});

const Worker = mongoose.model('Worker', workerSchema);

export default Worker;
