import Razorpay from "razorpay"
import crypto from "crypto"

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
})

export const createOrder = async (amount: number, currency = "INR") => {
  try {
    const options = {
      amount: Math.round(amount * 100),
      currency,
      receipt: `receipt_${Date.now()}`,
    }
    return await razorpay.orders.create(options)
  } catch (error) {
    console.error("[v0] Razorpay order creation error:", error)
    throw error
  }
}

export const verifyPaymentSignature = (orderId: string, paymentId: string, signature: string): boolean => {
  const body = `${orderId}|${paymentId}`
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
    .update(body)
    .digest("hex")
  return expectedSignature === signature
}
