const mongoose = require("mongoose")

const bookingSchema = new mongoose.Schema(
  {
    bookingId: { type: String, unique: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    workerId: { type: mongoose.Schema.Types.ObjectId, ref: "Worker", default: null },

    // Service Details
    serviceType: { type: String, required: true }, // e.g., 'house-cleaning'
    subService: { type: String, default: null },
    duration: { type: Number, required: true }, // in hours
    basePrice: { type: Number, required: true },

    // Location
    location: {
      address: String,
      city: String,
      zipCode: String,
      coordinates: [Number],
    },

    // Pricing
    baseAmount: Number,
    taxAmount: Number,
    discountAmount: { type: Number, default: 0 },
    discountCode: String,
    totalAmount: Number,

    // Status
    status: {
      type: String,
      enum: ["pending", "assigned", "confirmed", "in-progress", "completed", "cancelled"],
      default: "pending",
    },

    // Schedule
    scheduledDate: Date,
    scheduledTime: String,
    completedAt: Date,

    // Feedback & Rating
    feedback: {
      rating: { type: Number, min: 1, max: 5 },
      comment: String,
      photos: [String],
    },

    // Payment
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
    paymentStatus: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },

    // Additional Notes
    specialInstructions: String,
    cancellationReason: String,

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

module.exports = mongoose.model("Booking", bookingSchema)
