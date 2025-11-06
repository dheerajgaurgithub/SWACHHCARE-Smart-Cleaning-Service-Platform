const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6,
        select: false
    },
    phone: {
        type: String,
        required: [true, 'Please provide a phone number'],
        unique: true
    },
    otp: {
        type: String,
        select: false
    },
    otpExpire: Date,
    verified: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ['customer', 'worker', 'admin'],
        default: 'customer'
    },
    planType: {
        type: String,
        enum: ['basic', 'silver', 'gold', 'premium', null],
        default: null
    },
    address: {
        street: String,
        city: String,
        state: String,
        pincode: String,
        location: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: {
                type: [Number],
                default: [0, 0]
            }
        }
    },
    walletBalance: {
        type: Number,
        default: 0
    },
    referralCode: String,
    referredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    googleId: String,
    avatar: String
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Encrypt password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Match password
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate OTP
userSchema.methods.getOtp = function() {
    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.otp = otp;
    // Set OTP expiry to 10 minutes
    this.otpExpire = Date.now() + 10 * 60 * 1000;
    return otp;
};

// Generate password reset token
userSchema.methods.getResetPasswordToken = function() {
    const resetToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    return resetToken;
};

// Virtual for user's bookings
userSchema.virtual('bookings', {
    ref: 'Booking',
    localField: '_id',
    foreignField: 'userId',
    justOne: false
});

// Index for geospatial queries
userSchema.index({ 'address.location': '2dsphere' });

module.exports = mongoose.model('User', userSchema);
