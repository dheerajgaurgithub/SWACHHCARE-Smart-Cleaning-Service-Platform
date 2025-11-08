"use client"

import { useEffect, useState } from "react"
import { Wallet, Gift, ArrowDownLeft, ArrowUpRight } from "lucide-react"

interface Transaction {
  _id: string
  type: string
  amount: number
  description: string
  date: string
}

export default function WalletPage() {
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem("user") || "{}").id

    Promise.all([
      fetch(`/api/customers/${userId}/wallet`).then((r) => r.json()),
      fetch(`/api/payments/user/${userId}`).then((r) => r.json()),
    ]).then(([walletData, transactionsData]) => {
      setBalance(walletData.walletBalance || 0)
      setTransactions(transactionsData || [])
      setLoading(false)
    })
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Wallet & Credits</h1>

      {/* Balance Card */}
      <div className="bg-gradient-primary text-white rounded-xl p-8 mb-8 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-emerald-100 text-sm mb-2">Available Balance</p>
            <h2 className="text-4xl font-bold">₹{balance}</h2>
          </div>
          <Wallet size={48} className="text-emerald-200" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-semibold smooth-transition">
            Add Money
          </button>
          <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-semibold smooth-transition">
            Referral Code
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ArrowDownLeft className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{transactions.filter((t) => t.type === "payment").reduce((sum, t) => sum + t.amount, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <ArrowUpRight className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Referral Bonus</p>
              <p className="text-2xl font-bold text-gray-900">₹0</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Gift className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Promotions</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
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
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === "payment" ? "bg-red-100" : "bg-green-100"
                    }`}
                  >
                    {transaction.type === "payment" ? (
                      <ArrowDownLeft size={20} className="text-red-600" />
                    ) : (
                      <ArrowUpRight size={20} className="text-green-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 capitalize">{transaction.type}</p>
                    <p className="text-sm text-gray-600">{transaction.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-bold text-lg ${
                      transaction.type === "payment" ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {transaction.type === "payment" ? "-" : "+"}₹{transaction.amount}
                  </p>
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
