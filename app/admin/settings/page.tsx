"use client"

import { useState } from "react"
import { Settings, Palette, Bell, Lock } from "lucide-react"

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("platform")
  const [commission, setCommission] = useState(20)

  const tabs = [
    { id: "platform", label: "Platform Settings", icon: Settings },
    { id: "theme", label: "Theme Settings", icon: Palette },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Lock },
  ]

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

      {/* Platform Settings */}
      {activeTab === "platform" && (
        <div className="max-w-2xl">
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Commission Percentage (%)</label>
              <input
                type="number"
                value={commission}
                onChange={(e) => setCommission(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-gray-600 text-sm mt-2">Commission taken from each booking</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Payout Amount (₹)</label>
              <input
                type="number"
                defaultValue={500}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
              <input
                type="email"
                defaultValue="support@swachhcare.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700">
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Theme Settings */}
      {activeTab === "theme" && (
        <div className="max-w-2xl">
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">Primary Color</label>
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-lg cursor-pointer hover:opacity-80"></div>
                <input type="color" defaultValue="#2ecc71" className="h-16 cursor-pointer" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Logo Text</label>
              <input
                type="text"
                defaultValue="SwachhCare"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700">
              Save Theme
            </button>
          </div>
        </div>
      )}

      {/* Notifications */}
      {activeTab === "notifications" && (
        <div className="max-w-2xl">
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 space-y-4">
            {[
              { label: "New Worker Applications", key: "worker_applications" },
              { label: "Payment Alerts", key: "payment_alerts" },
              { label: "Customer Complaints", key: "complaints" },
              { label: "System Updates", key: "system_updates" },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <label className="font-medium text-gray-900">{item.label}</label>
                <input type="checkbox" className="w-5 h-5" defaultChecked />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security */}
      {activeTab === "security" && (
        <div className="max-w-2xl">
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Change Admin Password</h3>
              <div className="space-y-4">
                <input
                  type="password"
                  placeholder="Current Password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <button className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700">
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
