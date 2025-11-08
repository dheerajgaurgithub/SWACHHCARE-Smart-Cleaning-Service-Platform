"use client"

import { useEffect, useState } from "react"
import { DollarSign, ArrowUpRight, ArrowDownLeft, Calendar } from "lucide-react"

interface Transaction {
  _id: string
  userId?: string
  workerId?: string
  type: string
  amount: number
  method?: string
  status: string
  date: string
}

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [stats, setStats] = useState({ total: 0, commission: 0, payouts: 0 })
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    fetch("/api/payments")
      .then((r) => r.json())
      .then((data) => {
        const txns = data || []
        setTransactions(txns)

        const total = txns.filter((t) => t.type === "payment").reduce((sum, t) => sum + t.amount, 0)
        const commission = txns.filter((t) => t.type === "commission").reduce((sum, t) => sum + t.amount, 0)
        const payouts = txns.filter((t) => t.type === "salary").reduce((sum, t) => sum + t.amount, 0)

        setStats({ total, commission, payouts })
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  const filteredTransactions = filter === "all" ? transactions : transactions.filter((t) => t.type === filter)

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Transaction Management</h1>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900">₹{stats.total}</p>
            </div>
            <DollarSign className="text-emerald-600" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Commission Earned</p>
              <p className="text-3xl font-bold text-gray-900">₹{stats.commission}</p>
            </div>
            <ArrowUpRight className="text-blue-600" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Worker Payouts</p>
              <p className="text-3xl font-bold text-gray-900">₹{stats.payouts}</p>
            </div>
            <ArrowDownLeft className="text-red-600" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Profit Margin</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.total > 0 ? Math.round((stats.commission / stats.total) * 100) : 0}%
              </p>
            </div>
            <Calendar className="text-purple-600" size={32} />
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-3 mb-8">
        {["all", "payment", "commission", "salary"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-lg font-medium smooth-transition capitalize ${
              filter === type ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Transactions Table */}
      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Date</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Type</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Amount</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Method</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((txn, idx) => (
                <tr
                  key={txn._id}
                  className={`border-b border-gray-200 hover:bg-gray-50 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                >
                  <td className="py-4 px-6 text-gray-600">{new Date(txn.date).toLocaleDateString()}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                        txn.type === "payment"
                          ? "bg-green-100 text-green-800"
                          : txn.type === "commission"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {txn.type}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-bold text-gray-900">₹{txn.amount}</td>
                  <td className="py-4 px-6 text-gray-600">{txn.method || "Razorpay"}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                        txn.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : txn.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {txn.status}
                    </span>
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
