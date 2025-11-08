"use client"
import { MapPin, Phone, MessageCircle, Clock, CheckCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const activeBookings = [
  {
    id: "BK001",
    workerName: "Raj Kumar",
    service: "Home Cleaning",
    status: "In Progress",
    scheduledTime: "2:30 PM - 4:00 PM",
    distance: "1.2 km away",
    eta: "2 mins",
    phone: "+91 98765 43210",
    rating: 4.8,
    completedJobs: 342,
  },
  {
    id: "BK002",
    workerName: "Priya Singh",
    service: "Laundry Service",
    status: "Scheduled",
    scheduledTime: "Tomorrow 10:00 AM",
    distance: "N/A",
    eta: "N/A",
    phone: "+91 98765 43211",
    rating: 4.9,
    completedJobs: 512,
  },
  {
    id: "BK003",
    workerName: "Anil Patel",
    service: "Car Washing",
    status: "Completed",
    scheduledTime: "Today 12:00 PM",
    distance: "Completed",
    eta: "N/A",
    phone: "+91 98765 43212",
    rating: 4.7,
    completedJobs: 289,
  },
]

const getStatusIcon = (status) => {
  if (status === "In Progress") return <MapPin className="w-5 h-5 text-blue-500" />
  if (status === "Scheduled") return <Clock className="w-5 h-5 text-yellow-500" />
  if (status === "Completed") return <CheckCircle className="w-5 h-5 text-green-500" />
}

export default function TrackingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Active & Upcoming Bookings</h1>
        <p className="text-muted-foreground">Track your service workers and manage bookings in real-time</p>
      </div>

      {/* Active Bookings */}
      <div className="space-y-4">
        {activeBookings.map((booking) => (
          <Card key={booking.id} className="p-6">
            <div className="grid md:grid-cols-4 gap-6">
              {/* Worker Info */}
              <div>
                <h3 className="font-bold text-lg mb-1">{booking.workerName}</h3>
                <p className="text-sm text-muted-foreground mb-3">{booking.service}</p>
                <div className="flex items-center gap-1 mb-2">
                  <span className="font-semibold">{booking.rating}</span>
                  <span className="text-yellow-500 text-sm">★</span>
                  <span className="text-xs text-muted-foreground">({booking.completedJobs} jobs)</span>
                </div>
              </div>

              {/* Status & Time */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  {getStatusIcon(booking.status)}
                  <span
                    className={`font-semibold text-sm ${
                      booking.status === "In Progress"
                        ? "text-blue-600"
                        : booking.status === "Scheduled"
                          ? "text-yellow-600"
                          : "text-green-600"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{booking.scheduledTime}</p>
                {booking.eta !== "N/A" && <p className="text-sm font-medium text-primary">ETA: {booking.eta}</p>}
              </div>

              {/* Location */}
              <div>
                <p className="text-xs text-muted-foreground mb-1">Location</p>
                <p className="text-sm font-medium mb-4">{booking.distance}</p>
                {booking.status === "In Progress" && (
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    <MapPin className="w-4 h-4 mr-2" />
                    View Live Map
                  </Button>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <Button size="sm" variant="outline">
                  <Phone className="w-4 h-4 mr-2" />
                  Call
                </Button>
                <Button size="sm" variant="outline">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message
                </Button>
                {booking.status === "Completed" && (
                  <Button size="sm" variant="outline">
                    Rate & Review
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
