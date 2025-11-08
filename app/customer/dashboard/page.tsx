"use client"

import { useEffect, useState } from "react"
import { Calendar, Star, TrendingUp } from "lucide-react"
import Link from "next/link"
import { bookingAPI } from "@/lib/api/booking-api"
import { userAPI } from "@/lib/api/user-api"

interface Booking {
  _id: string
  serviceType: string
  date: string
  time: string
  status: string
  price: number
  rating?: number
}

export default function CustomerDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [walletBalance, setWalletBalance] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [bookingsData, walletData] = await Promise.all([bookingAPI.getCustomerBookings(), userAPI.getWallet()])

      setBookings(bookingsData.bookings || [])
      setWalletBalance(walletData.wallet?.balance || 0)
    } catch (err: any) {
      console.error("[Dashboard Error]", err)
      setError(err.message || "Failed to load dashboard")
    } finally {
      setLoading(false)
    }
  }

  const upcomingBookings = bookings.filter((b) => b.status === "confirmed")
  const completedBookings = bookings.filter((b) => b.status === "completed")

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Bookings</p>
              <p className="text-3xl font-bold text-gray-900">{bookings.length}</p>
            </div>
            <Calendar className="text-emerald-600" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Wallet Balance</p>
              <p className="text-3xl font-bold text-gray-900">₹{walletBalance}</p>
            </div>
            <TrendingUp className="text-blue-600" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Upcoming</p>
              <p className="text-3xl font-bold text-gray-900">{upcomingBookings.length}</p>
            </div>
            <Calendar className="text-orange-600" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Completed</p>
              <p className="text-3xl font-bold text-gray-900">{completedBookings.length}</p>
            </div>
            <Star className="text-yellow-600" size={32} />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          href="/customer/book-service"
          className="bg-gradient-primary text-white rounded-lg p-6 hover:opacity-90 smooth-transition"
        >
          <h3 className="text-lg font-semibold mb-2">Book a Service</h3>
          <p className="text-emerald-100">Schedule cleaning, car wash, or laundry</p>
        </Link>

        <Link
          href="/customer/wallet"
          className="bg-blue-600 text-white rounded-lg p-6 hover:opacity-90 smooth-transition"
        >
          <h3 className="text-lg font-semibold mb-2">View Wallet</h3>
          <p className="text-blue-100">Check balance and referral credits</p>
        </Link>

        <Link
          href="/customer/offers"
          className="bg-purple-600 text-white rounded-lg p-6 hover:opacity-90 smooth-transition"
        >
          <h3 className="text-lg font-semibold mb-2">Special Offers</h3>
          <p className="text-purple-100">Discounts and combo packs</p>
        </Link>
      </div>

      {/* Upcoming Bookings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Upcoming Bookings</h2>

        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : upcomingBookings.length > 0 ? (
          <div className="space-y-4">
            {upcomingBookings.map((booking) => (
              <div
                key={booking._id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 capitalize">{booking.serviceType}</h3>
                  <div className="flex items-center gap-4 text-gray-600 text-sm mt-2">
                    <span className="flex items-center gap-1">
                      <Calendar size={16} />
                      {new Date(booking.date).toLocaleDateString()}
                    </span>
                    <span>{booking.time}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">₹{booking.price}</p>
                  <span className="inline-block mt-1 px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-8">
            No upcoming bookings.{" "}
            <Link href="/customer/book-service" className="text-emerald-600 font-semibold">
              Book now
            </Link>
          </p>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold mb-4">Recent Completed Services</h2>

        {completedBookings.length > 0 ? (
          <div className="space-y-3">
            {completedBookings.slice(0, 5).map((booking) => (
              <div
                key={booking._id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div>
                  <p className="font-semibold text-gray-900 capitalize">{booking.serviceType}</p>
                  <p className="text-gray-600 text-sm">{new Date(booking.date).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-4">
                  {booking.rating && (
                    <div className="flex items-center gap-1">
                      {[...Array(booking.rating)].map((_, i) => (
                        <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  )}
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                    Completed
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-8">No completed bookings yet</p>
        )}
      </div>
    </div>
  )
}
