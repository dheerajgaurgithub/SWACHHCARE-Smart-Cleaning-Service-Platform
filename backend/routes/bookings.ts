import express, { type Router, type Request, type Response } from "express"
import Booking from "../models/Booking"
import { authMiddleware } from "../middleware/auth"

const router: Router = express.Router()

// Get all bookings
router.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { userId } = req.query
    const bookings = await Booking.find({
      $or: [{ customerId: userId }, { workerId: userId }],
    }).populate("customerId workerId")
    res.json({ success: true, bookings })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Create booking
router.post("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { service, package: pkg, date, time, address, totalAmount } = req.body

    const booking = new Booking({
      customerId: req.user.userId,
      service,
      package: pkg,
      date,
      time,
      address,
      totalAmount,
    })

    await booking.save()
    res.status(201).json({ success: true, booking })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Update booking
router.put("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json({ success: true, booking })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Delete booking
router.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    await Booking.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: "Booking deleted" })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

export default router
