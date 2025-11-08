import express, { type Router, type Request, type Response } from "express"
import Payment from "../models/Payment"
import Booking from "../models/Booking"
import { authMiddleware } from "../middleware/auth"
import { createOrder, verifyPaymentSignature } from "../utils/razorpay"

const router: Router = express.Router()

// Initiate payment
router.post("/initiate", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { bookingId, amount, method } = req.body

    const razorpayOrder = await createOrder(amount)

    const payment = new Payment({
      bookingId,
      userId: req.user.userId,
      amount,
      method,
      razorpayOrderId: razorpayOrder.id,
      status: "pending",
    })

    await payment.save()

    res.status(201).json({
      success: true,
      payment,
      razorpayKey: process.env.RAZORPAY_KEY_ID,
      order: razorpayOrder,
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Verify payment
router.post("/verify", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body

    const isValid = verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature)

    if (!isValid) {
      return res.status(400).json({ error: "Invalid payment signature" })
    }

    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId },
      {
        status: "completed",
        razorpayPaymentId,
        razorpaySignature,
      },
      { new: true },
    )

    // Update booking status
    await Booking.findByIdAndUpdate(payment?.bookingId, { status: "Confirmed" })

    res.json({ success: true, payment })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

export default router
