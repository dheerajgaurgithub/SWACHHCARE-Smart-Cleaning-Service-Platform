import crypto from "crypto"

export async function POST(request: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json()

    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!).update(body).digest("hex")

    if (expectedSignature === razorpay_signature) {
      return Response.json({ success: true, message: "Payment verified" })
    } else {
      return Response.json({ success: false, message: "Payment verification failed" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error verifying payment:", error)
    return Response.json({ error: "Verification failed" }, { status: 500 })
  }
}
