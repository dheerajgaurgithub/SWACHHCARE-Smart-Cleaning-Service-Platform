import express, { type Router, type Request, type Response } from "express"
import User from "../models/User"
import Task from "../models/Task"
import { authMiddleware } from "../middleware/auth"

const router: Router = express.Router()

// Get available workers
router.get("/", async (req: Request, res: Response) => {
  try {
    const workers = await User.find({ role: "worker" }).select("-password")
    res.json({ success: true, workers })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Get worker tasks
router.get("/:workerId/tasks", authMiddleware, async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find({ workerId: req.params.workerId }).populate("bookingId")
    res.json({ success: true, tasks })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Update worker profile
router.put("/:workerId", authMiddleware, async (req: Request, res: Response) => {
  try {
    const worker = await User.findByIdAndUpdate(req.params.workerId, req.body, { new: true })
    res.json({ success: true, worker })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

export default router
