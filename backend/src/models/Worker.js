const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    documentType: {
        type: String,
        required: true,
        enum: ['aadhaar', 'pan', 'driving_license', 'other']
    },
    documentNumber: {
        type: String,
        required: true
    },
    documentImage: {
        type: String, // URL to the document image
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    }
}, { _id: false });

const availabilitySchema = new mongoose.Schema({
    day: {
        type: String,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        required: true
    },
    slots: [{
        start: {
            type: String, // Store as 'HH:MM' format
            required: true
        },
        end: {
            type: String, // Store as 'HH:MM' format
            required: true
        },
        available: {
            type: Boolean,
            default: true
        }
    }]
}, { _id: false });

const workerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    skills: [{
        type: String,
        enum: ['cleaning', 'laundry', 'car_wash', 'deep_cleaning', 'disinfection', 'other']
    }],
    documents: [documentSchema],
    experience: {
        type: Number, // in years
        min: 0,
        default: 0
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    totalRatings: {
        type: Number,
        default: 0
    },
    completedJobs: {
        type: Number,
        default: 0
    },
    availability: [availabilitySchema],
    isAvailable: {
        type: Boolean,
        default: true
    },
    currentLocation: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            default: [0, 0]
        },
        lastUpdated: Date
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'suspended'],
        default: 'pending'
    },
    rejectionReason: String,
    bankDetails: {
        accountNumber: String,
        accountHolderName: String,
        bankName: String,
        ifscCode: String,
        upiId: String
    },
    earnings: {
        totalEarnings: {
            type: Number,
            default: 0
        },
        availableBalance: {
            type: Number,
            default: 0
        },
        lifetimeEarnings: {
            type: Number,
            default: 0
        },
        pendingWithdrawal: {
            type: Number,
            default: 0
        }
    },
    lastActive: Date,
    isOnline: {
        type: Boolean,
        default: false
    },
    serviceAreas: [{
        type: String // Can be pincodes or area names
    }],
    languages: [{
        type: String
    }],
    bio: String,
    profileCompleted: {
        type: Boolean,
        default: false
    },
    verificationStatus: {
        identity: {
            type: Boolean,
            default: false
        },
        address: {
            type: Boolean,
            default: false
        },
        backgroundCheck: {
            type: Boolean,
            default: false
        }
    },
    trainingCompleted: {
        type: Boolean,
        default: false
    },
    trainingScores: {
        cleaning: {
            type: Number,
            min: 0,
            max: 100
        },
        customerService: {
            type: Number,
            min: 0,
            max: 100
        },
        safety: {
            type: Number,
            min: 0,
            max: 100
        }
    },
    performance: {
        averageRating: {
            type: Number,
            min: 0,
            max: 5,
            default: 0
        },
        jobsCompleted: {
            type: Number,
            default: 0
        },
        cancellationRate: {
            type: Number,
            default: 0
        },
        responseTime: Number // in minutes
    },
    documentsVerified: {
        type: Boolean,
        default: false
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    lastLocationUpdate: Date,
    deviceToken: String // For push notifications
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Index for geospatial queries
workerSchema.index({ currentLocation: '2dsphere' });

// Virtual for worker's bookings
workerSchema.virtual('bookings', {
    ref: 'Booking',
    localField: '_id',
    foreignField: 'workerId',
    justOne: false
});

// Virtual for worker's reviews
workerSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'workerId',
    justOne: false
});

// Method to update worker's rating
workerSchema.methods.updateRating = async function(newRating) {
    const totalRatings = this.performance.jobsCompleted + 1;
    const newAverageRating = ((this.performance.averageRating * this.performance.jobsCompleted) + newRating) / totalRatings;
    
    this.performance.averageRating = parseFloat(newAverageRating.toFixed(1));
    this.performance.jobsCompleted = totalRatings;
    
    await this.save();
    return this.performance.averageRating;
};

// Pre-save hook to update lastActive
workerSchema.pre('save', function(next) {
    if (this.isModified('isOnline') && this.isOnline) {
        this.lastActive = new Date();
    }
    next();
});

module.exports = mongoose.model('Worker', workerSchema);
