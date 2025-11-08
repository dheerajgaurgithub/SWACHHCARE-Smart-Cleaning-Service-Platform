const express = require("express")
const router = express.Router()
const Booking = require("../models/Booking")

// Create booking
router.post("/", async (req, res) => {
  try {
    const booking = new Booking(req.body)
    await booking.save()
    res.status(201).json({ message: "Booking created", booking })
  } catch (error) {
    res.status(500).json({ message: "Error creating booking" })
  }
})

// Get customer bookings
router.get("/customer/:customerId", async (req, res) => {
  try {
    const bookings = await Booking.find({ customerId: req.params.customerId })
    res.json(bookings)
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings" })
  }
})

// Get worker bookings
router.get("/worker/:workerId", async (req, res) => {
  try {
    const bookings = await Booking.find({ workerId: req.params.workerId })
    res.json(bookings)
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings" })
  }
})

// Update booking status
router.put("/:id", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json({ message: "Booking updated", booking })
  } catch (error) {
    res.status(500).json({ message: "Error updating booking" })
  }
})

module.exports = router
