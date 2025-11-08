const express = require("express")
const { auth, adminOnly } = require("../middlewares/auth")
const validate = require("../middlewares/validate")

const router = express.Router()

router.post("/", async (req, res, next) => {
  try {
    const ContactMessage = require("../models/ContactMessage")
    const contact = await ContactMessage.create(req.body)
    res.status(201).json({ success: true, data: contact })
  } catch (error) {
    next(error)
  }
})

router.get("/", auth, adminOnly, async (req, res, next) => {
  try {
    const ContactMessage = require("../models/ContactMessage")
    const messages = await ContactMessage.find({}).sort({ createdAt: -1 })
    res.status(200).json({ success: true, data: messages })
  } catch (error) {
    next(error)
  }
})

router.post("/:id/reply", auth, adminOnly, async (req, res, next) => {
  try {
    const ContactMessage = require("../models/ContactMessage")
    const { reply } = req.body

    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      {
        adminReply: reply,
        repliedAt: new Date(),
        repliedBy: req.user._id,
        status: "replied",
      },
      { new: true },
    )

    res.status(200).json({ success: true, data: message })
  } catch (error) {
    next(error)
  }
})

module.exports = router
