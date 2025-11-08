const express = require("express")
const router = express.Router()
const Worker = require("../models/Worker")
const User = require("../models/User")

// Get all workers
router.get("/", async (req, res) => {
  try {
    const workers = await Worker.find({ approved: true }).populate("userId")
    res.json(workers)
  } catch (error) {
    res.status(500).json({ message: "Error fetching workers" })
  }
})

// Get worker profile
router.get("/:id", async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id).populate("userId")
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" })
    }
    res.json(worker)
  } catch (error) {
    res.status(500).json({ message: "Error fetching worker" })
  }
})

// Get pending workers (for admin approval)
router.get("/pending/list", async (req, res) => {
  try {
    const workers = await Worker.find({ approved: false }).populate("userId")
    res.json(workers)
  } catch (error) {
    res.status(500).json({ message: "Error fetching pending workers" })
  }
})

// Approve worker (admin only)
router.post("/:id/approve", async (req, res) => {
  try {
    const worker = await Worker.findByIdAndUpdate(req.params.id, { approved: true }, { new: true })
    res.json({ message: "Worker approved", worker })
  } catch (error) {
    res.status(500).json({ message: "Error approving worker" })
  }
})

module.exports = router
