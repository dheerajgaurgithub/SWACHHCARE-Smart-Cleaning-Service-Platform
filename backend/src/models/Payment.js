const mongoose = require("mongoose")

const paymentSchema = new mongoose.Schema(
  {
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // Razorpay Details
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,

    // Amount
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },

    // Status
    status: {
      type: String,
      enum: ["pending", "captured", "failed", "refunded"],
      default: "pending",
    },

    // Payment Method
    paymentMethod: { type: String, enum: ["razorpay", "wallet", "card"], default: "razorpay" },

    // Refund
    refundId: String,
    refundedAmount: { type: Number, default: 0 },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

module.exports = mongoose.model("Payment", paymentSchema)
