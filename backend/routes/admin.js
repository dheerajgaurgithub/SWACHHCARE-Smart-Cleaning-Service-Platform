const express = require("express")
const router = express.Router()
const User = require("../models/User")
const Worker = require("../models/Worker")
const Booking = require("../models/Booking")
const Transaction = require("../models/Transaction")

// Admin Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    if (email === "dheerajgaur.0fficial@gmail.com" && password === "iloveyou160106") {
      res.json({
        message: "Admin login successful",
        role: "admin",
        token: "admin-token-123",
      })
    } else {
      res.status(401).json({ message: "Invalid credentials" })
    }
  } catch (error) {
    res.status(500).json({ message: "Error logging in" })
  }
})

// Get dashboard stats
router.get("/dashboard/stats", async (req, res) => {
  try {
    const totalCustomers = await User.countDocuments({ role: "customer" })
    const totalWorkers = await Worker.countDocuments({ approved: true })
    const totalBookings = await Booking.countDocuments()
    const totalRevenue = await Transaction.aggregate([
      { $match: { type: "payment" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ])

    res.json({
      totalCustomers,
      totalWorkers,
      totalBookings,
      totalRevenue: totalRevenue[0]?.total || 0,
    })
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats" })
  }
})

// Get all bookings
router.get("/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find().populate("customerId workerId")
    res.json(bookings)
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings" })
  }
})

module.exports = router
