"use client"

import { useState } from "react"
import { User, Shield, Bell } from "lucide-react"

export default function WorkerSettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [skills, setSkills] = useState(["Cleaning", "Car Washing"])
  const [newSkill, setNewSkill] = useState("")

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "skills", label: "Skills", icon: Shield },
    { id: "availability", label: "Availability", icon: Bell },
  ]

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill])
      setNewSkill("")
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Settings</h1>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-8 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 smooth-transition ${
              activeTab === tab.id
                ? "border-emerald-600 text-emerald-600 font-semibold"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <tab.icon size={20} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="max-w-2xl">
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700">
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Skills Tab */}
      {activeTab === "skills" && (
        <div className="max-w-2xl">
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-6 text-gray-900">Your Skills</h3>

            <div className="mb-6">
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a new skill"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  onClick={handleAddSkill}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {skills.map((skill, idx) => (
                <div
                  key={idx}
                  className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full flex items-center gap-2"
                >
                  <span className="font-medium">{skill}</span>
                  <button
                    onClick={() => setSkills(skills.filter((_, i) => i !== idx))}
                    className="text-emerald-600 hover:text-emerald-800 font-bold"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Availability Tab */}
      {activeTab === "availability" && (
        <div className="max-w-2xl">
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-6 text-gray-900">Set Your Availability</h3>

            <div className="space-y-4">
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                <div key={day} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                  <input type="checkbox" className="w-5 h-5" defaultChecked={day !== "Sunday"} />
                  <span className="flex-1 font-medium text-gray-900">{day}</span>
                  <div className="flex gap-2">
                    <input
                      type="time"
                      className="px-3 py-1 border border-gray-300 rounded text-sm"
                      defaultValue="08:00"
                    />
                    <input
                      type="time"
                      className="px-3 py-1 border border-gray-300 rounded text-sm"
                      defaultValue="18:00"
                    />
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-6 px-6 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700">
              Save Availability
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
