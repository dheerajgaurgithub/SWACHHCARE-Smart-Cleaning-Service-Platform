"use client"

import { useEffect, useState } from "react"
import { Calendar, Clock, TrendingUp, Award, CheckCircle } from "lucide-react"
import Link from "next/link"
import { bookingAPI } from "@/lib/api/booking-api"
import { workerAPI } from "@/lib/api/worker-api"

interface Task {
  _id: string
  serviceType: string
  date: string
  time: string
  status: string
  price: number
  customerName?: string
}

export default function WorkerDashboard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [stats, setStats] = useState({
    totalEarnings: 0,
    completedTasks: 0,
    todaysTasks: 0,
    rating: 4.5,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWorkerData()
  }, [])

  const fetchWorkerData = async () => {
    try {
      setLoading(true)
      const [tasksData, earningsData] = await Promise.all([
        bookingAPI.getWorkerBookings(),
        workerAPI.getEarnings("total"),
      ])

      const allTasks = tasksData.bookings || []
      setTasks(allTasks)

      const completed = allTasks.filter((t) => t.status === "completed").length
      const today = allTasks.filter((t) => new Date(t.date).toDateString() === new Date().toDateString()).length
      const totalEarnings = earningsData.total || 0

      setStats({
        totalEarnings: Math.round(totalEarnings),
        completedTasks: completed,
        todaysTasks: today,
        rating: 4.5,
      })
    } catch (err) {
      console.error("[Worker Dashboard Error]", err)
    } finally {
      setLoading(false)
    }
  }

  const assignedTasks = tasks.filter((t) => t.status === "confirmed")

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Earnings</p>
              <p className="text-3xl font-bold text-gray-900">₹{stats.totalEarnings}</p>
            </div>
            <TrendingUp className="text-emerald-600" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Completed Tasks</p>
              <p className="text-3xl font-bold text-gray-900">{stats.completedTasks}</p>
            </div>
            <CheckCircle className="text-green-600" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Today's Tasks</p>
              <p className="text-3xl font-bold text-gray-900">{stats.todaysTasks}</p>
            </div>
            <Calendar className="text-blue-600" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Your Rating</p>
              <p className="text-3xl font-bold text-gray-900">{stats.rating}</p>
            </div>
            <Award className="text-yellow-600" size={32} />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link
          href="/worker/tasks"
          className="bg-gradient-primary text-white rounded-lg p-6 hover:opacity-90 smooth-transition"
        >
          <h3 className="text-lg font-semibold mb-2">My Tasks</h3>
          <p className="text-emerald-100">{assignedTasks.length} tasks pending</p>
        </Link>

        <Link
          href="/worker/attendance"
          className="bg-blue-600 text-white rounded-lg p-6 hover:opacity-90 smooth-transition"
        >
          <h3 className="text-lg font-semibold mb-2">Check-in</h3>
          <p className="text-blue-100">Mark your attendance for today</p>
        </Link>
      </div>

      {/* Assigned Tasks */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold mb-4">Assigned Tasks</h2>

        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : assignedTasks.length > 0 ? (
          <div className="space-y-4">
            {assignedTasks.map((task) => (
              <div
                key={task._id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 capitalize">{task.serviceType}</h3>
                  <div className="flex items-center gap-4 text-gray-600 text-sm mt-2">
                    <span className="flex items-center gap-1">
                      <Calendar size={16} />
                      {new Date(task.date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={16} />
                      {task.time}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-emerald-600">₹{Math.round(task.price * 0.8)}</p>
                  <Link
                    href={`/worker/tasks/${task._id}`}
                    className="mt-2 inline-block text-blue-600 hover:underline text-sm font-semibold"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-8">No tasks assigned. Check back soon!</p>
        )}
      </div>
    </div>
  )
}
