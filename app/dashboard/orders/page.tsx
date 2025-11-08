"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Phone } from "lucide-react"

export default function OrdersPage() {
  // Mock order data
  const orders = [
    {
      id: "ORD-001",
      service: "Home Cleaning",
      date: "2025-01-15",
      time: "10:00 AM",
      status: "Completed",
      amount: "₹999",
      worker: "Raj Kumar",
      phone: "+91-9876543210",
      address: "123 Green Street, Mumbai",
      package: "Professional - 4 hours",
      rating: 5,
    },
    {
      id: "ORD-002",
      service: "Laundry Service",
      date: "2025-01-20",
      time: "02:00 PM",
      status: "Scheduled",
      amount: "₹499",
      worker: "Priya Singh",
      phone: "+91-9123456789",
      address: "456 Maple Avenue, Mumbai",
      package: "Basic - 2 hours",
      rating: null,
    },
    {
      id: "ORD-003",
      service: "Car Wash",
      date: "2025-01-25",
      time: "03:00 PM",
      status: "Cancelled",
      amount: "₹599",
      worker: "Unassigned",
      phone: "-",
      address: "789 Oak Road, Mumbai",
      package: "Standard",
      rating: null,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800"
      case "Scheduled":
        return "bg-blue-100 text-blue-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">My Orders</h1>
        <p className="text-muted-foreground">View your service history and upcoming bookings</p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="overflow-hidden">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">{order.id}</p>
                      <h3 className="text-2xl font-bold">{order.service}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{order.package}</p>
                    </div>
                    <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar size={16} className="text-muted-foreground" />
                      <span>
                        {order.date} at {order.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin size={16} className="text-muted-foreground" />
                      <span>{order.address}</span>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {order.worker !== "Unassigned" && (
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-2">Assigned Worker</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{order.worker}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Phone size={14} /> {order.phone}
                          </p>
                        </div>
                        {order.rating && (
                          <div className="text-right">
                            <p className="text-sm font-semibold">Rating</p>
                            <p className="text-lg text-yellow-500">{"⭐".repeat(order.rating)}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                      <p className="text-3xl font-bold text-primary">{order.amount}</p>
                    </div>
                    <div className="flex gap-2">
                      {order.status === "Completed" && (
                        <Button variant="outline" size="sm">
                          Rebook
                        </Button>
                      )}
                      {order.status === "Scheduled" && (
                        <Button variant="destructive" size="sm">
                          Cancel
                        </Button>
                      )}
                      <Button size="sm">Details</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
