"use client"

import { useState } from "react"
import { Calendar, Clock, CheckCircle, XCircle } from "lucide-react"

export default function AttendancePage() {
  const [checkStatus, setCheckStatus] = useState<"idle" | "checkedIn" | "checkedOut">("idle")
  const [checkInTime, setCheckInTime] = useState<string | null>(null)
  const [attendanceRecords, setAttendanceRecords] = useState([
    { date: "2024-01-08", checkIn: "08:30 AM", checkOut: "05:00 PM", hours: 8.5 },
    { date: "2024-01-07", checkIn: "08:15 AM", checkOut: "04:45 PM", hours: 8.5 },
    { date: "2024-01-06", checkIn: "08:45 AM", checkOut: "05:15 PM", hours: 8.5 },
  ])

  const handleCheckIn = () => {
    const now = new Date()
    const timeString = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    setCheckInTime(timeString)
    setCheckStatus("checkedIn")
  }

  const handleCheckOut = () => {
    setCheckStatus("checkedOut")
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Attendance & Check-in</h1>

      {/* Check-in Card */}
      <div className="bg-gradient-primary text-white rounded-lg p-8 mb-8 shadow-lg">
        <div className="text-center mb-8">
          <p className="text-emerald-100 mb-2">Current Time</p>
          <p className="text-4xl font-bold">{new Date().toLocaleTimeString()}</p>
          <p className="text-emerald-100 text-sm mt-2">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {checkStatus === "idle" ? (
          <button
            onClick={handleCheckIn}
            className="w-full py-4 bg-white text-emerald-600 rounded-lg font-bold text-lg hover:bg-gray-100 smooth-transition"
          >
            Check In
          </button>
        ) : checkStatus === "checkedIn" ? (
          <div className="space-y-4">
            <div className="bg-white/20 p-4 rounded-lg text-center">
              <p className="text-emerald-100 mb-2">Checked In</p>
              <p className="text-2xl font-bold">{checkInTime}</p>
            </div>
            <button
              onClick={handleCheckOut}
              className="w-full py-4 bg-red-500 hover:bg-red-600 rounded-lg font-bold text-lg smooth-transition"
            >
              Check Out
            </button>
          </div>
        ) : (
          <div className="text-center">
            <CheckCircle size={48} className="mx-auto mb-4" />
            <p className="text-xl font-semibold">You have checked out</p>
            <p className="text-emerald-100 text-sm mt-2">Thank you for your work today!</p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">This Month Hours</p>
              <p className="text-3xl font-bold text-gray-900">127.5</p>
            </div>
            <Clock className="text-blue-600" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Days Worked</p>
              <p className="text-3xl font-bold text-gray-900">15</p>
            </div>
            <Calendar className="text-green-600" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Absences</p>
              <p className="text-3xl font-bold text-gray-900">2</p>
            </div>
            <XCircle className="text-red-600" size={32} />
          </div>
        </div>
      </div>

      {/* Attendance Records */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold mb-6 text-gray-900">Recent Attendance</h2>

        <div className="space-y-4">
          {attendanceRecords.map((record, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div>
                <p className="font-semibold text-gray-900">
                  {new Date(record.date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <div className="flex gap-4 text-sm text-gray-600 mt-1">
                  <span>In: {record.checkIn}</span>
                  <span>Out: {record.checkOut}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{record.hours} hrs</p>
                <span className="inline-block mt-1 px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                  Present
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
