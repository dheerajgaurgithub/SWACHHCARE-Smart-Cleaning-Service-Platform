const mongoose = require("mongoose")

const bookingSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  workerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Worker",
  },
  serviceType: {
    type: String,
    enum: ["cleaning", "carwash", "laundry", "combo"],
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    default: 2, // in hours
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "completed", "cancelled"],
    default: "pending",
  },
  price: {
    type: Number,
    required: true,
  },
  paymentId: String,
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  feedback: String,
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Booking", bookingSchema)
