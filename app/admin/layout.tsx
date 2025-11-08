"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, LogOut, BarChart3, Users, Briefcase, CreditCard, Settings, Mail } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/auth/login")
  }

  const menuItems = [
    { icon: BarChart3, label: "Dashboard", href: "/admin/dashboard" },
    { icon: Users, label: "Customers", href: "/admin/customers" },
    { icon: Briefcase, label: "Workers", href: "/admin/workers" },
    { icon: CreditCard, label: "Transactions", href: "/admin/transactions" },
    { icon: Mail, label: "Messages", href: "/admin/messages" },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
  ]

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 shadow-lg transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static`}
      >
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">SC</span>
            </div>
            <div>
              <span className="font-bold text-lg text-white">SwachhCare</span>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-emerald-600 hover:text-white rounded-lg smooth-transition"
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-900/20 rounded-lg smooth-transition"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden p-2 hover:bg-gray-100 rounded-lg">
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 md:p-8">{children}</div>
        </div>
      </div>
    </div>
  )
}
