import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import validator from 'validator';

const customerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
    },
    username: {
      type: String,
      required: [true, 'Please choose a username'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot be more than 30 characters'],
      match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscores']
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    authMethod: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Please add a phone number'],
      unique: true,
      validate: {
        validator: function(v) {
          return /^[0-9]{10,15}$/.test(v);
        },
        message: props => `${props.value} is not a valid phone number!`
      }
    },
    dateOfBirth: {
      type: Date,
      validate: {
        validator: function(v) {
          return v < new Date();
        },
        message: 'Date of birth must be in the past'
      }
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer-not-to-say'],
      default: 'prefer-not-to-say'
    },
    profilePicture: {
      type: String,
      default: 'default.jpg'
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false,
    },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      pincode: { type: String, default: '' },
    },
    houseSize: {
      type: String,
      enum: ['1BHK', '2BHK', '3BHK', '4BHK+', 'Villa'],
      default: '1BHK',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpire: Date,
    phoneVerificationOTP: String,
    phoneVerificationExpire: Date,
    passwordResetToken: String,
    passwordResetExpire: Date,
    emailChangeToken: String,
    emailChangeExpire: Date,
    newEmail: String,
    phoneChangeOTP: String,
    phoneChangeExpire: Date,
    newPhone: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    googleId: String,
    facebookId: String,
    subscription: {
      packageType: {
        type: String,
        enum: ['None', 'Basic', 'Standard', 'Premium'],
        default: 'None',
      },
      startDate: Date,
      endDate: Date,
      isActive: {
        type: Boolean,
        default: false,
      },
    },
    bookings: [
      {
        serviceType: {
          type: String,
          enum: ['Cleaning', 'Laundry', 'Car Wash'],
          required: true,
        },
        workerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Worker',
        },
        date: {
          type: Date,
          required: true,
        },
        status: {
          type: String,
          enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
          default: 'pending',
        },
        paymentStatus: {
          type: String,
          enum: ['pending', 'paid', 'refunded', 'failed'],
          default: 'pending',
        },
        amount: {
          type: Number,
          required: true,
        },
        address: {
          type: String,
          required: true,
        },
        specialInstructions: String,
        cancellationReason: String,
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        review: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    wallet: {
      balance: {
        type: Number,
        default: 0,
      },
      transactions: [
        {
          type: {
            type: String,
            enum: ['credit', 'debit'],
            required: true,
          },
          amount: {
            type: Number,
            required: true,
          },
          description: {
            type: String,
            required: true,
          },
          reference: {
            type: String,
            required: true,
          },
          status: {
            type: String,
            enum: ['success', 'failed', 'pending'],
            default: 'pending',
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    },
    notifications: [
      {
        type: {
          type: String,
          enum: ['booking', 'payment', 'promotion', 'system'],
          required: true,
        },
        message: {
          type: String,
          required: true,
        },
        isRead: {
          type: Boolean,
          default: false,
        },
        link: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    fcmToken: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: Date,
    role: {
      type: String,
      enum: ['customer', 'worker', 'admin'],
      default: 'customer',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Encrypt password using bcrypt
customerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
customerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password reset token
customerSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
};

// Generate email verification token
customerSchema.methods.createEmailVerificationToken = function() {
  const verificationToken = crypto.randomBytes(32).toString('hex');
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
  this.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  return verificationToken;
};

// Generate phone verification OTP
customerSchema.methods.createPhoneVerificationOTP = async function() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.phoneVerificationOTP = await bcrypt.hash(otp, 10);
  this.phoneVerificationExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  return otp;
};

// Generate email change token
customerSchema.methods.createEmailChangeToken = function(newEmail) {
  const token = crypto.randomBytes(32).toString('hex');
  this.emailChangeToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  this.newEmail = newEmail;
  this.emailChangeExpire = Date.now() + 60 * 60 * 1000; // 1 hour
  return token;
};

// Generate phone change OTP
customerSchema.methods.createPhoneChangeOTP = async function(newPhone) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.phoneChangeOTP = await bcrypt.hash(otp, 10);
  this.newPhone = newPhone;
  this.phoneChangeExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  return otp;
};

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;
