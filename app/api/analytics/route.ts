import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "month"

    // Mock analytics data
    const analyticsData = {
      totalRevenue: 245670,
      totalUsers: 156,
      totalBookings: 342,
      activeWorkers: 58,
      completionRate: 96,
      averageRating: 4.7,
      growthRate: 24,
      period,
    }

    return NextResponse.json({ success: true, analytics: analyticsData }, { status: 200 })
  } catch (error) {
    console.error("[v0] Fetch analytics error:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
