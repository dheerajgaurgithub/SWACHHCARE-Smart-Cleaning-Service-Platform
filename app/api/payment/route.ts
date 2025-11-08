import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { bookingId, amount, method } = await request.json()

    if (!bookingId || !amount || !method) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Mock payment processing
    const payment = {
      id: `payment_${Date.now()}`,
      bookingId,
      amount,
      method,
      status: "Success",
      transactionId: `txn_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
    }

    return NextResponse.json({ success: true, payment }, { status: 201 })
  } catch (error) {
    console.error("[v0] Payment error:", error)
    return NextResponse.json({ error: "Payment processing failed" }, { status: 500 })
  }
}
