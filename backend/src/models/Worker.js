const mongoose = require("mongoose")

const workerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // Professional Info
    skills: [String], // e.g., ['house-cleaning', 'carpet-cleaning']
    experience: { type: Number, default: 0 }, // in years
    certifications: [
      {
        name: String,
        certificateUrl: String,
        issueDate: Date,
      },
    ],

    // Documents
    documents: {
      aadhar: { type: String, default: null },
      aadharVerified: { type: Boolean, default: false },
      panCard: { type: String, default: null },
      panVerified: { type: Boolean, default: false },
      backgroundCheck: { type: String, default: null },
      backgroundCheckVerified: { type: Boolean, default: false },
    },

    // Availability & Location
    isAvailable: { type: Boolean, default: false },
    currentLocation: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: [Number], // [longitude, latitude]
    },
    serviceRadius: { type: Number, default: 5 }, // in km
    workingHours: {
      startTime: String, // HH:mm
      endTime: String,
      daysOff: [Number], // 0-6 (Sunday-Saturday)
    },

    // Rating & Performance
    totalRating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    completedJobs: { type: Number, default: 0 },
    cancelledJobs: { type: Number, default: 0 },

    // Earnings
    totalEarnings: { type: Number, default: 0 },
    walletBalance: { type: Number, default: 0 },
    pendingPayouts: { type: Number, default: 0 },

    // Attendance
    attendanceRecords: [
      {
        date: Date,
        checkIn: Date,
        checkOut: Date,
        hoursWorked: Number,
      },
    ],

    // Status
    approvalStatus: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    isBlocked: { type: Boolean, default: false },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

workerSchema.index({ currentLocation: "2dsphere" })

module.exports = mongoose.model("Worker", workerSchema)
