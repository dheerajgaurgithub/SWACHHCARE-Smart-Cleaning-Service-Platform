import { type NextRequest, NextResponse } from "next/server"

// Mock users database - replace with real database in production
const mockUsers = [
  {
    id: "user_1",
    name: "Rahul Sharma",
    email: "rahul@example.com",
    password: "password123",
    role: "customer",
  },
  {
    id: "worker_1",
    name: "Raj Kumar",
    email: "raj@example.com",
    password: "password123",
    role: "worker",
  },
  {
    id: "admin_1",
    name: "Admin",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
  },
]

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 })
    }

    // Find user
    const user = mockUsers.find((u) => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token: `token_${user.id}_${Date.now()}`,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
