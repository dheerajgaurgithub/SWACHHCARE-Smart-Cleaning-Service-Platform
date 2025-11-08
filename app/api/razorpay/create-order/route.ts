export async function POST(request: Request) {
  try {
    const { amount } = await request.json()

    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`,
        ).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      }),
    })

    const order = await response.json()
    return Response.json(order)
  } catch (error) {
    console.error("Error creating order:", error)
    return Response.json({ error: "Failed to create order" }, { status: 500 })
  }
}
