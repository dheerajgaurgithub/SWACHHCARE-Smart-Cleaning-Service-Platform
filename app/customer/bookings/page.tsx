"use client"

import { useEffect, useState } from "react"
import { Calendar, MapPin, Star, MessageSquare } from "lucide-react"

interface Booking {
  _id: string
  serviceType: string
  date: string
  time: string
  status: string
  price: number
  rating?: number
  feedback?: string
  address?: string
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filter, setFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem("user") || "{}").id

    fetch(`/api/bookings/customer/${userId}`)
      .then((r) => r.json())
      .then((data) => {
        setBookings(data || [])
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  const filteredBookings = filter === "all" ? bookings : bookings.filter((b) => b.status === filter)

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-900">My Bookings</h1>

      {/* Filter Buttons */}
      <div className="flex gap-3 mb-8 flex-wrap">
        {["all", "pending", "confirmed", "completed", "cancelled"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium smooth-transition capitalize ${
              filter === status ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : filteredBookings.length > 0 ? (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md smooth-transition"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 capitalize mb-2">{booking.serviceType}</h3>
                  <div className="flex flex-col gap-2 text-gray-600 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      {new Date(booking.date).toLocaleDateString()} at {booking.time}
                    </div>
                    {booking.address && (
                      <div className="flex items-center gap-2">
                        <MapPin size={16} />
                        {booking.address}
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-4 md:mt-0 text-right">
                  <p className="text-2xl font-bold text-gray-900 mb-2">₹{booking.price}</p>
                  <span
                    className={`inline-block px-4 py-2 rounded-full text-sm font-semibold capitalize ${
                      booking.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : booking.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : booking.status === "confirmed"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
              </div>

              {booking.status === "completed" && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      {booking.rating ? (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Your rating:</span>
                          <div className="flex gap-1">
                            {[...Array(booking.rating)].map((_, i) => (
                              <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600">Please rate this service</p>
                      )}
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                      <MessageSquare size={16} />
                      {booking.feedback ? "Edit Feedback" : "Add Feedback"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
          <p className="text-gray-600 mb-4">No bookings found</p>
          <a href="/customer/book-service" className="text-emerald-600 font-semibold hover:underline">
            Book a service now
          </a>
        </div>
      )}
    </div>
  )
}
