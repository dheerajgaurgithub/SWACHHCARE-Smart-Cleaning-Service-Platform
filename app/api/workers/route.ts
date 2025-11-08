import { type NextRequest, NextResponse } from "next/server"

// Mock workers database
const workers: any[] = []

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const service = searchParams.get("service")
    const minRating = searchParams.get("minRating")

    let result = workers

    if (service) {
      result = result.filter((w) => w.services.includes(service))
    }

    if (minRating) {
      result = result.filter((w) => w.rating >= Number.parseFloat(minRating))
    }

    return NextResponse.json({ success: true, workers: result }, { status: 200 })
  } catch (error) {
    console.error("[v0] Fetch workers error:", error)
    return NextResponse.json({ error: "Failed to fetch workers" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, services, availability } = await request.json()

    if (!userId || !services) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newWorker = {
      id: `worker_${Date.now()}`,
      userId,
      services,
      availability,
      rating: 0,
      tasksCompleted: 0,
      status: "Available",
      createdAt: new Date(),
    }

    workers.push(newWorker)

    return NextResponse.json({ success: true, worker: newWorker }, { status: 201 })
  } catch (error) {
    console.error("[v0] Create worker error:", error)
    return NextResponse.json({ error: "Failed to create worker profile" }, { status: 500 })
  }
}
