"use client"

import { useEffect, useState } from "react"
import { CheckCircle, Clock } from "lucide-react"

interface Worker {
  _id: string
  userId?: { name: string; email: string }
  name?: string
  email?: string
  approved: boolean
  skills: string[]
  rating: number
  createdAt: string
}

export default function AdminWorkersPage() {
  const [workers, setWorkers] = useState<Worker[]>([])
  const [filter, setFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetch("/api/workers").then((r) => r.json()), fetch("/api/workers/pending/list").then((r) => r.json())])
      .then(([approvedWorkers, pendingWorkers]) => {
        setWorkers([...approvedWorkers, ...pendingWorkers])
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  const handleApproveWorker = async (workerId: string) => {
    try {
      await fetch(`/api/workers/${workerId}/approve`, { method: "POST" })
      setWorkers(workers.map((w) => (w._id === workerId ? { ...w, approved: true } : w)))
    } catch (error) {
      console.error(error)
    }
  }

  const filteredWorkers =
    filter === "all"
      ? workers
      : filter === "approved"
        ? workers.filter((w) => w.approved)
        : workers.filter((w) => !w.approved)

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Worker Management</h1>

      {/* Filter Buttons */}
      <div className="flex gap-3 mb-8">
        {["all", "approved", "pending"].map((status) => (
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

      {/* Workers Table */}
      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Name</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Email</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Skills</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Rating</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkers.map((worker, idx) => (
                <tr
                  key={worker._id}
                  className={`border-b border-gray-200 hover:bg-gray-50 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                >
                  <td className="py-4 px-6 font-medium text-gray-900">{worker.userId?.name || worker.name || "N/A"}</td>
                  <td className="py-4 px-6 text-gray-600">{worker.userId?.email || worker.email || "N/A"}</td>
                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-2">
                      {worker.skills?.slice(0, 2).map((skill, i) => (
                        <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-6 font-semibold text-gray-900">{worker.rating || 0}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                        worker.approved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {worker.approved ? (
                        <>
                          <CheckCircle size={14} />
                          Approved
                        </>
                      ) : (
                        <>
                          <Clock size={14} />
                          Pending
                        </>
                      )}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {!worker.approved && (
                      <button
                        onClick={() => handleApproveWorker(worker._id)}
                        className="px-3 py-1 bg-emerald-600 text-white rounded text-xs font-semibold hover:bg-emerald-700"
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
