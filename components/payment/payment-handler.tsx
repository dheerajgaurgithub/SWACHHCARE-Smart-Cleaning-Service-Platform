"use client"

import { useState } from "react"
import { paymentAPI } from "@/lib/api/payment-api"
import { CreditCard, Loader } from "lucide-react"

interface PaymentHandlerProps {
  amount: number
  bookingId?: string
  onSuccess?: (paymentId: string) => void
  onError?: (error: string) => void
}

interface RazorpayWindow extends Window {
  Razorpay: any
}

declare const window: RazorpayWindow

export default function PaymentHandler({ amount, bookingId, onSuccess, onError }: PaymentHandlerProps) {
  const [loading, setLoading] = useState(false)

  const handlePayment = async () => {
    setLoading(true)
    try {
      if (!window.Razorpay) {
        throw new Error("Razorpay library not loaded")
      }

      const amountInPaisa = Math.round(amount * 100)

      // Create order
      const orderData = await paymentAPI.createOrder(amountInPaisa, bookingId || "")

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amountInPaisa,
        currency: "INR",
        name: "SwachhCare",
        description: `Payment for Booking`,
        order_id: orderData.orderId,
        handler: async (response: any) => {
          try {
            // Verify payment
            await paymentAPI.verifyPayment(orderData.orderId, response.razorpay_payment_id, response.razorpay_signature)

            onSuccess?.(response.razorpay_payment_id)
          } catch (err: any) {
            onError?.(err.message || "Payment verification failed")
          }
        },
        theme: {
          color: "#10b981",
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (err: any) {
      onError?.(err.message || "Payment initiation failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 smooth-transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
    >
      {loading ? (
        <>
          <Loader className="animate-spin" size={20} />
          Processing...
        </>
      ) : (
        <>
          <CreditCard size={20} />
          Pay ₹{amount}
        </>
      )}
    </button>
  )
}
