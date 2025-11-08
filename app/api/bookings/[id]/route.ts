import { type NextRequest, NextResponse } from "next/server"

// Mock bookings database
const bookings: any[] = [
  {
    id: "booking_1",
    customerId: "user_1",
    service: "Home Cleaning",
    date: "2025-01-15",
    time: "10:00 AM",
    status: "Completed",
  },
]

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const booking = bookings.find((b) => b.id === params.id)

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, booking }, { status: 200 })
  } catch (error) {
    console.error("[v0] Fetch booking error:", error)
    return NextResponse.json({ error: "Failed to fetch booking" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { status } = await request.json()

    const booking = bookings.find((b) => b.id === params.id)

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    booking.status = status
    booking.updatedAt = new Date()

    return NextResponse.json({ success: true, booking }, { status: 200 })
  } catch (error) {
    console.error("[v0] Update booking error:", error)
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 })
  }
}
