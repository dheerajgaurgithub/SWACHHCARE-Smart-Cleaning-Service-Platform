"use client"

import { useEffect, useState } from "react"
import { TrendingUp, DollarSign, Calendar, BarChart3 } from "lucide-react"

interface Transaction {
  _id: string
  type: string
  amount: number
  description: string
  date: string
}

export default function WorkerEarningsPage() {
  const [earnings, setEarnings] = useState({
    today: 0,
    week: 0,
    month: 0,
    total: 0,
  })
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")

    Promise.all([
      fetch(`/api/payments/user/${user.id}`).then((r) => r.json()),
      fetch(`/api/bookings/worker/${user.id}`).then((r) => r.json()),
    ]).then(([paymentsData, tasksData]) => {
      setTransactions(paymentsData || [])

      // Calculate earnings from completed tasks
      const now = new Date()
      const tasks = tasksData || []

      const todayTasks = tasks.filter((t) => {
        const taskDate = new Date(t.date)
        return t.status === "completed" && taskDate.toDateString() === now.toDateString()
      })

      const weekTasks = tasks.filter((t) => {
        const taskDate = new Date(t.date)
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        return t.status === "completed" && taskDate >= weekAgo && taskDate <= now
      })

      const monthTasks = tasks.filter((t) => {
        const taskDate = new Date(t.date)
        return t.status === "completed" && taskDate.getMonth() === now.getMonth()
      })

      const allCompletedTasks = tasks.filter((t) => t.status === "completed")

      setEarnings({
        today: todayTasks.reduce((sum, t) => sum + t.price * 0.8, 0),
        week: weekTasks.reduce((sum, t) => sum + t.price * 0.8, 0),
        month: monthTasks.reduce((sum, t) => sum + t.price * 0.8, 0),
        total: allCompletedTasks.reduce((sum, t) => sum + t.price * 0.8, 0),
      })

      setLoading(false)
    })
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Earnings & Income</h1>

      {/* Earnings Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Today's Earnings</p>
              <p className="text-3xl font-bold text-gray-900">₹{Math.round(earnings.today)}</p>
            </div>
            <Calendar className="text-blue-600" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">This Week</p>
              <p className="text-3xl font-bold text-gray-900">₹{Math.round(earnings.week)}</p>
            </div>
            <TrendingUp className="text-green-600" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">This Month</p>
              <p className="text-3xl font-bold text-gray-900">₹{Math.round(earnings.month)}</p>
            </div>
            <BarChart3 className="text-purple-600" size={32} />
          </div>
        </div>

        <div className="bg-gradient-primary text-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm">Total Earnings</p>
              <p className="text-3xl font-bold">₹{Math.round(earnings.total)}</p>
            </div>
            <DollarSign className="text-emerald-200" size={32} />
          </div>
        </div>
      </div>

      {/* Request Payout Button */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Request Payout</h3>
            <p className="text-gray-600 text-sm">Minimum amount: ₹500</p>
          </div>
          <button className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700">
            Request Withdrawal
          </button>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold mb-6 text-gray-900">Transaction History</h2>

        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : transactions.length > 0 ? (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction._id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <DollarSign size={20} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 capitalize">{transaction.type}</p>
                    <p className="text-sm text-gray-600">{transaction.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-emerald-600">₹{transaction.amount}</p>
                  <p className="text-sm text-gray-600">{new Date(transaction.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-8">No transactions yet</p>
        )}
      </div>
    </div>
  )
}
