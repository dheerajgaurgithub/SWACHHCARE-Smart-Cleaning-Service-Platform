const mongoose = require("mongoose")

const transactionSchema = new mongoose.Schema(
  {
    transactionId: { type: String, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    workerId: { type: mongoose.Schema.Types.ObjectId, ref: "Worker", default: null },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", default: null },

    // Transaction Details
    type: {
      type: String,
      enum: ["payment", "commission", "refund", "payout", "wallet-credit", "wallet-debit"],
      required: true,
    },

    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },

    // Status
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },

    // Commission (if applicable)
    commission: { type: Number, default: 0 },
    commissionPercentage: { type: Number, default: 0 },

    // Description
    description: String,
    metadata: mongoose.Schema.Types.Mixed,

    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false },
)

module.exports = mongoose.model("Transaction", transactionSchema)
