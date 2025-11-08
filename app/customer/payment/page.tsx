"use client"

import type React from "react"

import { useState } from "react"
import { CreditCard, Wallet, Lock } from "lucide-react"
import { useRouter } from "next/navigation"
import { paymentAPI } from "@/lib/api/payment-api"
import { userAPI } from "@/lib/api/user-api"

interface RazorpayWindow extends Window {
  Razorpay: any
}

declare const window: RazorpayWindow

export default function PaymentPage() {
  const router = useRouter()
  const [paymentMethod, setPaymentMethod] = useState("razorpay")
  const [amount, setAmount] = useState(599)
  const [loading, setLoading] = useState(false)

  const handleRazorpayPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}")

      const orderData = await paymentAPI.createOrder(amount * 100, user.id)

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "SwachhCare",
        description: "Service Payment",
        order_id: orderData.orderId,
        handler: async (response: any) => {
          try {
            await paymentAPI.verifyPayment(orderData.orderId, response.razorpay_payment_id, response.razorpay_signature)

            await userAPI.addWalletBalance(amount, response.razorpay_payment_id)

            router.push("/customer/wallet")
          } catch (err) {
            console.error("Payment verification failed:", err)
          }
        },
        theme: { color: "#10b981" },
      }

      const Razorpay = window.Razorpay
      new Razorpay(options).open()
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Payment & Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Methods */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Payment Method</h2>

            <div className="space-y-4 mb-8">
              <label
                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer smooth-transition ${
                  paymentMethod === "razorpay"
                    ? "border-emerald-600 dark:border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-emerald-600"
                }`}
              >
                <input
                  type="radio"
                  name="method"
                  value="razorpay"
                  checked={paymentMethod === "razorpay"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-5 h-5"
                />
                <CreditCard size={24} className="ml-3 text-gray-600 dark:text-gray-400" />
                <span className="ml-3 font-semibold text-gray-900 dark:text-white">
                  Razorpay (UPI, Cards, NetBanking)
                </span>
              </label>

              <label
                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer smooth-transition ${
                  paymentMethod === "wallet"
                    ? "border-emerald-600 dark:border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-emerald-600"
                }`}
              >
                <input
                  type="radio"
                  name="method"
                  value="wallet"
                  checked={paymentMethod === "wallet"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-5 h-5"
                />
                <Wallet size={24} className="ml-3 text-gray-600 dark:text-gray-400" />
                <span className="ml-3 font-semibold text-gray-900 dark:text-white">Wallet Balance</span>
              </label>
            </div>

            {paymentMethod === "razorpay" && (
              <form onSubmit={handleRazorpayPayment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Amount (₹)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number.parseFloat(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 smooth-transition"
                >
                  <Lock size={18} />
                  {loading ? "Processing..." : "Pay with Razorpay"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Order Summary</h2>

            <div className="space-y-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Service Amount</span>
                <span className="font-semibold text-gray-900 dark:text-white">₹{amount}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Tax & Fees</span>
                <span className="font-semibold text-gray-900 dark:text-white">₹0</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-lg mb-8">
              <span className="font-semibold text-gray-900 dark:text-white">Total Amount</span>
              <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">₹{amount}</span>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <strong>Secure Payment:</strong> All transactions are encrypted and secure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
