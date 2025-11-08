"use client"

import { useEffect, useState } from "react"
import { Calendar, MapPin, CheckCircle, XCircle } from "lucide-react"

interface Task {
  _id: string
  serviceType: string
  date: string
  time: string
  status: string
  price: number
  address?: string
}

export default function WorkerTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")

    fetch(`/api/bookings/worker/${user.id}`)
      .then((r) => r.json())
      .then((data) => {
        setTasks(data || [])
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  const filteredTasks = filter === "all" ? tasks : tasks.filter((t) => t.status === filter)

  const handleStatusUpdate = async (taskId: string, newStatus: string) => {
    try {
      await fetch(`/api/bookings/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      setTasks(tasks.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t)))
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-900">My Tasks</h1>

      {/* Filter Buttons */}
      <div className="flex gap-3 mb-8 flex-wrap">
        {["all", "pending", "confirmed", "completed"].map((status) => (
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

      {/* Tasks List */}
      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : filteredTasks.length > 0 ? (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <div
              key={task._id}
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md smooth-transition"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 capitalize mb-3">{task.serviceType}</h3>
                  <div className="space-y-2 text-gray-600 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      {new Date(task.date).toLocaleDateString()} at {task.time}
                    </div>
                    {task.address && (
                      <div className="flex items-center gap-2">
                        <MapPin size={16} />
                        {task.address}
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-4 md:mt-0 text-right">
                  <p className="text-2xl font-bold text-emerald-600 mb-3">₹{Math.round(task.price * 0.8)}</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      task.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : task.status === "confirmed"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              {task.status === "confirmed" && (
                <div className="mt-6 pt-6 border-t border-gray-200 flex gap-3">
                  <button
                    onClick={() => handleStatusUpdate(task._id, "completed")}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
                  >
                    <CheckCircle size={18} />
                    Mark Complete
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(task._id, "cancelled")}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
                  >
                    <XCircle size={18} />
                    Cancel Task
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
          <p className="text-gray-600">No {filter !== "all" ? filter : ""} tasks</p>
        </div>
      )}
    </div>
  )
}
