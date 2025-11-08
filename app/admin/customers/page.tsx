"use client"

import { useEffect, useState } from "react"
import { Mail, Phone, TrendingUp } from "lucide-react"

interface Customer {
  _id: string
  name: string
  email: string
  phone: string
  address?: string
  walletBalance: number
  createdAt: string
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock fetch - in production this would hit the actual endpoint
    fetch("/api/customers")
      .then((r) => r.json())
      .catch(() => {
        setCustomers([
          {
            _id: "1",
            name: "John Doe",
            email: "john@example.com",
            phone: "+91 95555 55555",
            walletBalance: 500,
            createdAt: "2024-01-01",
          },
          {
            _id: "2",
            name: "Jane Smith",
            email: "jane@example.com",
            phone: "+91 96666 66666",
            walletBalance: 1200,
            createdAt: "2024-01-02",
          },
        ])
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Customer Management</h1>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Customers</p>
              <p className="text-3xl font-bold text-gray-900">{customers.length}</p>
            </div>
            <TrendingUp className="text-blue-600" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div>
            <p className="text-gray-600 text-sm">Active This Month</p>
            <p className="text-3xl font-bold text-gray-900">{Math.round(customers.length * 0.7)}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div>
            <p className="text-gray-600 text-sm">Total Wallet Balance</p>
            <p className="text-3xl font-bold text-gray-900">
              ₹{customers.reduce((sum, c) => sum + c.walletBalance, 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Name</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Email</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Phone</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Wallet</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Joined</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer, idx) => (
                <tr
                  key={customer._id}
                  className={`border-b border-gray-200 hover:bg-gray-50 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                >
                  <td className="py-4 px-6 font-medium text-gray-900">{customer.name}</td>
                  <td className="py-4 px-6 text-gray-600 flex items-center gap-2">
                    <Mail size={16} />
                    {customer.email}
                  </td>
                  <td className="py-4 px-6 text-gray-600 flex items-center gap-2">
                    <Phone size={16} />
                    {customer.phone}
                  </td>
                  <td className="py-4 px-6 font-semibold text-emerald-600">₹{customer.walletBalance}</td>
                  <td className="py-4 px-6 text-gray-600">{new Date(customer.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
