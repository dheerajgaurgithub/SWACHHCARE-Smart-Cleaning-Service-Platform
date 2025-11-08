const mongoose = require("mongoose")

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },

    // Status
    status: {
      type: String,
      enum: ["new", "viewed", "replied"],
      default: "new",
    },

    // Reply
    adminReply: String,
    repliedAt: Date,
    repliedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

module.exports = mongoose.model("ContactMessage", contactSchema)
