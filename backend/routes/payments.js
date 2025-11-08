const express = require("express")
const router = express.Router()
const Transaction = require("../models/Transaction")

// Create payment
router.post("/", async (req, res) => {
  try {
    const transaction = new Transaction(req.body)
    await transaction.save()
    res.status(201).json({ message: "Payment recorded", transaction })
  } catch (error) {
    res.status(500).json({ message: "Error processing payment" })
  }
})

// Get transactions
router.get("/", async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 })
    res.json(transactions)
  } catch (error) {
    res.status(500).json({ message: "Error fetching transactions" })
  }
})

// Get user transactions
router.get("/user/:userId", async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.params.userId })
    res.json(transactions)
  } catch (error) {
    res.status(500).json({ message: "Error fetching transactions" })
  }
})

module.exports = router
