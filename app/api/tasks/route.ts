import { type NextRequest, NextResponse } from "next/server"

// Mock tasks database
const tasks: any[] = []

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const workerId = searchParams.get("workerId")
    const status = searchParams.get("status")

    let result = tasks

    if (workerId) {
      result = result.filter((t) => t.workerId === workerId)
    }

    if (status) {
      result = result.filter((t) => t.status === status)
    }

    return NextResponse.json({ success: true, tasks: result }, { status: 200 })
  } catch (error) {
    console.error("[v0] Fetch tasks error:", error)
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { bookingId, workerId, estimatedTime } = await request.json()

    if (!bookingId || !workerId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newTask = {
      id: `task_${Date.now()}`,
      bookingId,
      workerId,
      estimatedTime,
      status: "Assigned",
      createdAt: new Date(),
    }

    tasks.push(newTask)

    return NextResponse.json({ success: true, task: newTask }, { status: 201 })
  } catch (error) {
    console.error("[v0] Create task error:", error)
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 })
  }
}
