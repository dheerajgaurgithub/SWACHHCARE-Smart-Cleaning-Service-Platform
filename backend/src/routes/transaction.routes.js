const express = require("express")
const { auth, adminOnly } = require("../middlewares/auth")

const router = express.Router()

router.get("/", auth, adminOnly, async (req, res, next) => {
  try {
    const Transaction = require("../models/Transaction")
    const { startDate, endDate, type } = req.query

    const query = {}
    if (startDate || endDate) {
      query.createdAt = {}
      if (startDate) query.createdAt.$gte = new Date(startDate)
      if (endDate) query.createdAt.$lte = new Date(endDate)
    }
    if (type) query.type = type

    const transactions = await Transaction.find(query)
      .populate("userId", "name email")
      .populate("workerId", "name")
      .sort({ createdAt: -1 })

    res.status(200).json({ success: true, data: transactions })
  } catch (error) {
    next(error)
  }
})

module.exports = router
