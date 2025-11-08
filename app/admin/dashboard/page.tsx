"use client"

import { useEffect, useState } from "react"
import { Users, Briefcase, TrendingUp, CreditCard, BarChart3, CheckCircle } from "lucide-react"
import Link from "next/link"
import { adminAPI } from "@/lib/api/admin-api"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalWorkers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingApprovals: 0,
    activeBookings: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const data = await adminAPI.getDashboardStats()
      setStats(data.stats || data)
    } catch (err) {
      console.error("[Admin Dashboard Error]", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
            </div>
            <Users className="text-blue-600" size={28} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs">Total Workers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalWorkers}</p>
            </div>
            <Briefcase className="text-green-600" size={28} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
            </div>
            <CheckCircle className="text-purple-600" size={28} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{stats.totalRevenue}</p>
            </div>
            <TrendingUp className="text-emerald-600" size={28} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs">Pending Approvals</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingApprovals}</p>
            </div>
            <BarChart3 className="text-orange-600" size={28} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs">Active Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeBookings}</p>
            </div>
            <CreditCard className="text-red-600" size={28} />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          href="/admin/workers"
          className="bg-gradient-primary text-white rounded-lg p-6 hover:opacity-90 smooth-transition"
        >
          <h3 className="text-lg font-semibold mb-2">Approve Workers</h3>
          <p className="text-emerald-100">{stats.pendingApprovals} pending</p>
        </Link>

        <Link
          href="/admin/transactions"
          className="bg-blue-600 text-white rounded-lg p-6 hover:opacity-90 smooth-transition"
        >
          <h3 className="text-lg font-semibold mb-2">View Transactions</h3>
          <p className="text-blue-100">Revenue: ₹{stats.totalRevenue}</p>
        </Link>

        <Link
          href="/admin/messages"
          className="bg-purple-600 text-white rounded-lg p-6 hover:opacity-90 smooth-transition"
        >
          <h3 className="text-lg font-semibold mb-2">Contact Messages</h3>
          <p className="text-purple-100">New inquiries</p>
        </Link>
      </div>

      {/* Recent Activity Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold mb-4 text-gray-900">Revenue Trend</h2>
          <div className="h-64 bg-gray-50 rounded-lg flex items-end justify-around p-4">
            {[30, 45, 60, 40, 70, 50, 80].map((height, idx) => (
              <div
                key={idx}
                className="w-8 bg-gradient-primary rounded-t opacity-80 hover:opacity-100"
                style={{ height: `${height}%` }}
              ></div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold mb-4 text-gray-900">Bookings by Service</h2>
          <div className="space-y-4">
            {[
              { name: "Home Cleaning", value: 45, percent: 45 },
              { name: "Car Washing", value: 30, percent: 30 },
              { name: "Laundry", value: 25, percent: 25 },
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700 font-medium">{item.name}</span>
                  <span className="text-gray-900 font-bold">{item.value}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-primary h-2 rounded-full" style={{ width: `${item.percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold mb-4 text-gray-900">Recent Bookings</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Customer</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Service</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Amount</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  customer: "John Doe",
                  service: "Home Cleaning",
                  date: "2024-01-08",
                  amount: 599,
                  status: "Completed",
                },
                { customer: "Jane Smith", service: "Car Washing", date: "2024-01-08", amount: 299, status: "Pending" },
                { customer: "Mike Johnson", service: "Laundry", date: "2024-01-07", amount: 499, status: "Completed" },
              ].map((booking, idx) => (
                <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900">{booking.customer}</td>
                  <td className="py-3 px-4 text-gray-900">{booking.service}</td>
                  <td className="py-3 px-4 text-gray-600">{booking.date}</td>
                  <td className="py-3 px-4 font-semibold text-gray-900">₹{booking.amount}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        booking.status === "Completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
