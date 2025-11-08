"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchBookings } from "@/lib/slices/bookingSlice"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Briefcase, Clock, CheckCircle2, Loader2 } from "lucide-react"
import type { AppDispatch, RootState } from "@/lib/store"

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()

  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth)
  const { bookings, loading } = useSelector((state: RootState) => state.bookings)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login")
    } else if (user?.id) {
      dispatch(fetchBookings(user.id))
    }
  }, [isAuthenticated, user?.id, dispatch, router])

  const stats = [
    {
      label: "Active Orders",
      value: bookings.filter((b) => b.status === "Confirmed").length,
      icon: Briefcase,
      color: "text-blue-600",
    },
    {
      label: "Completed",
      value: bookings.filter((b) => b.status === "Completed").length,
      icon: CheckCircle2,
      color: "text-green-600",
    },
    { label: "Total Bookings", value: bookings.length, icon: Clock, color: "text-purple-600" },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-muted-foreground">Here's your dashboard overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <Icon className={`${stat.color} w-4 h-4`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Action Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <CardTitle>Book a New Service</CardTitle>
            <CardDescription>Schedule a cleaning, laundry, or car wash service</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/dashboard/bookings" className="flex items-center justify-center gap-2">
                Book Now <ArrowRight size={18} />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Special Offer</CardTitle>
            <CardDescription>Get 20% off on your next booking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-secondary/30 p-4 rounded-lg mb-4">
              <p className="font-semibold text-primary">Use code: SWACHH20</p>
            </div>
            <Button variant="outline" className="w-full bg-transparent">
              Copy Code
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Your upcoming services</CardDescription>
            </div>
            <Button variant="outline" asChild>
              <Link href="/dashboard/orders">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.slice(0, 5).map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="font-semibold">{booking.service}</p>
                    <p className="text-sm text-muted-foreground">{booking.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-primary">{booking.status}</p>
                    <p className="text-xs text-muted-foreground">₹{booking.totalAmount}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No bookings yet. Start by booking a service.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
