const express = require("express")
const { auth, adminOnly } = require("../middlewares/auth")
const validate = require("../middlewares/validate")

const router = express.Router()

// Dashboard Stats
router.get("/stats", auth, adminOnly, async (req, res, next) => {
  try {
    const Booking = require("../models/Booking")
    const Transaction = require("../models/Transaction")
    const User = require("../models/User")
    const Worker = require("../models/Worker")

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const totalRevenue = await Transaction.aggregate([
      { $match: { type: "commission", status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ])

    const todayRevenue = await Transaction.aggregate([
      {
        $match: {
          type: "commission",
          status: "completed",
          createdAt: { $gte: todayStart },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ])

    const stats = {
      totalUsers: await User.countDocuments(),
      totalWorkers: await Worker.countDocuments({ approvalStatus: "approved" }),
      totalBookings: await Booking.countDocuments(),
      totalRevenue: totalRevenue[0]?.total || 0,
      todayRevenue: todayRevenue[0]?.total || 0,
      activeWorkers: await Worker.countDocuments({ isAvailable: true }),
    }

    res.status(200).json({ success: true, data: stats })
  } catch (error) {
    next(error)
  }
})

// Update Settings
router.put("/settings", auth, adminOnly, async (req, res, next) => {
  try {
    const AdminSettings = require("../models/AdminSettings")
    const settings = await AdminSettings.findOneAndUpdate({}, req.body, { new: true, upsert: true })
    res.status(200).json({ success: true, data: settings })
  } catch (error) {
    next(error)
  }
})

// Get Settings
router.get("/settings", auth, adminOnly, async (req, res, next) => {
  try {
    const AdminSettings = require("../models/AdminSettings")
    const settings = await AdminSettings.findOne({})
    res.status(200).json({ success: true, data: settings })
  } catch (error) {
    next(error)
  }
})

module.exports = router
