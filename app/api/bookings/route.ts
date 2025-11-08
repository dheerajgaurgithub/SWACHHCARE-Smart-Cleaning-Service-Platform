import { type NextRequest, NextResponse } from "next/server"

// Mock bookings database
const bookings: any[] = []

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    let result = bookings

    if (userId) {
      result = result.filter((b) => b.customerId === userId || b.workerId === userId)
    }

    return NextResponse.json({ success: true, bookings: result }, { status: 200 })
  } catch (error) {
    console.error("[v0] Fetch bookings error:", error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { customerId, service, date, time, address, package: pkg } = await request.json()

    if (!customerId || !service || !date || !time || !address || !pkg) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newBooking = {
      id: `booking_${Date.now()}`,
      customerId,
      service,
      date,
      time,
      address,
      package: pkg,
      status: "Pending",
      createdAt: new Date(),
    }

    bookings.push(newBooking)

    return NextResponse.json(
      {
        success: true,
        booking: newBooking,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Create booking error:", error)
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}
