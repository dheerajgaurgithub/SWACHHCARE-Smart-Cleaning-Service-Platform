const mongoose = require("mongoose")

const workerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  skills: [String],
  documents: [
    {
      type: String,
      url: String,
    },
  ],
  approved: {
    type: Boolean,
    default: false,
  },
  availability: [
    {
      day: String,
      startTime: String,
      endTime: String,
    },
  ],
  assignedTasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
  ],
  totalEarnings: {
    type: Number,
    default: 0,
  },
  attendance: [
    {
      date: Date,
      checkIn: Date,
      checkOut: Date,
    },
  ],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Worker", workerSchema)
