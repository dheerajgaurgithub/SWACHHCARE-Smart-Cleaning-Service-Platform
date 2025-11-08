const express = require("express")
const { auth } = require("../middlewares/auth")

const router = express.Router()

router.post("/", auth, async (req, res, next) => {
  try {
    const ChatMessage = require("../models/ChatMessage")
    const message = await ChatMessage.create({
      ...req.body,
      senderId: req.user._id,
    })
    res.status(201).json({ success: true, data: message })
  } catch (error) {
    next(error)
  }
})

router.get("/:conversationId", auth, async (req, res, next) => {
  try {
    const ChatMessage = require("../models/ChatMessage")
    const messages = await ChatMessage.find({
      conversationId: req.params.conversationId,
    }).sort({ createdAt: 1 })
    res.status(200).json({ success: true, data: messages })
  } catch (error) {
    next(error)
  }
})

module.exports = router
