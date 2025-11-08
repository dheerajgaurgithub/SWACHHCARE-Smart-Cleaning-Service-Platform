const express = require("express")
const router = express.Router()
const User = require("../models/User")

// Get customer profile
router.get("/:id", async (req, res) => {
  try {
    const customer = await User.findById(req.params.id)
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" })
    }
    res.json(customer)
  } catch (error) {
    res.status(500).json({ message: "Error fetching customer" })
  }
})

// Update customer profile
router.put("/:id", async (req, res) => {
  try {
    const customer = await User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(customer)
  } catch (error) {
    res.status(500).json({ message: "Error updating customer" })
  }
})

// Get wallet balance
router.get("/:id/wallet", async (req, res) => {
  try {
    const customer = await User.findById(req.params.id)
    res.json({ walletBalance: customer.walletBalance })
  } catch (error) {
    res.status(500).json({ message: "Error fetching wallet" })
  }
})

module.exports = router
