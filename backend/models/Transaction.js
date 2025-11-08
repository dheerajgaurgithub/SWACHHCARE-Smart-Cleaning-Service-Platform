const mongoose = require("mongoose")

const transactionSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  workerId: mongoose.Schema.Types.ObjectId,
  type: {
    type: String,
    enum: ["payment", "salary", "commission", "refund"],
  },
  amount: {
    type: Number,
    required: true,
  },
  method: String,
  description: String,
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  date: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Transaction", transactionSchema)
