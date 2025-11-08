"use client"

import { useState } from "react"
import { User, Bell, Shield, Moon } from "lucide-react"
import { useTheme } from "@/app/providers"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const { theme, toggleTheme } = useTheme()
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: true,
  })

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "preferences", label: "Preferences", icon: Moon },
  ]

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg p-8 smooth-transition">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Settings</h1>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-8 border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 smooth-transition ${
              activeTab === tab.id
                ? "border-emerald-600 text-emerald-600 dark:text-emerald-400 font-semibold"
                : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
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
          <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-8 space-y-6">
            {[
              { label: "Full Name", type: "text", placeholder: "Your name" },
              { label: "Email", type: "email", placeholder: "your@email.com", disabled: true },
              { label: "Phone", type: "tel", placeholder: "+91 95555 55555" },
            ].map((field, idx) => (
              <div key={idx}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{field.label}</label>
                <input
                  type={field.type}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder={field.placeholder}
                  disabled={field.disabled}
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Address</label>
              <textarea
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Your address"
              ></textarea>
            </div>

            <button className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white rounded-lg font-semibold smooth-transition">
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Preferences Tab with Dark Mode */}
      {activeTab === "preferences" && (
        <div className="max-w-2xl">
          <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-8 space-y-6">
            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Dark Mode</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Enable dark theme for comfortable viewing</p>
              </div>
              <button
                onClick={toggleTheme}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  theme === "dark" ? "bg-emerald-500" : "bg-gray-300 dark:bg-gray-600"
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    theme === "dark" ? "translate-x-6" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>

            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Language</label>
              <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option>English</option>
                <option>Hindi</option>
                <option>Spanish</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <div className="max-w-2xl">
          <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-8 space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white capitalize">{key} Notifications</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Get {key} updates about your bookings</p>
                </div>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() => setNotifications({ ...notifications, [key]: !value })}
                  className="w-6 h-6 cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <div className="max-w-2xl">
          <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-8 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Change Password</h3>
              <div className="space-y-4">
                {["Current Password", "New Password", "Confirm Password"].map((label, idx) => (
                  <div key={idx}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                    />
                  </div>
                ))}
              </div>
              <button className="mt-4 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white rounded-lg font-semibold smooth-transition">
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
