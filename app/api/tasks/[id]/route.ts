import { type NextRequest, NextResponse } from "next/server"

// Mock tasks database
const tasks: any[] = []

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const task = tasks.find((t) => t.id === params.id)

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, task }, { status: 200 })
  } catch (error) {
    console.error("[v0] Fetch task error:", error)
    return NextResponse.json({ error: "Failed to fetch task" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updates = await request.json()

    const task = tasks.find((t) => t.id === params.id)

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    Object.assign(task, updates, { updatedAt: new Date() })

    return NextResponse.json({ success: true, task }, { status: 200 })
  } catch (error) {
    console.error("[v0] Update task error:", error)
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 })
  }
}
