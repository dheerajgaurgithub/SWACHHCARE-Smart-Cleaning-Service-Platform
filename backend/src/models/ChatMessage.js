const mongoose = require("mongoose")

const chatSchema = new mongoose.Schema(
  {
    conversationId: { type: String, required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", default: null },

    message: { type: String, required: true },
    messageType: { type: String, enum: ["text", "image", "file"], default: "text" },

    isRead: { type: Boolean, default: false },
    readAt: Date,

    attachments: [
      {
        url: String,
        type: String,
        size: Number,
      },
    ],

    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

module.exports = mongoose.model("ChatMessage", chatSchema)
