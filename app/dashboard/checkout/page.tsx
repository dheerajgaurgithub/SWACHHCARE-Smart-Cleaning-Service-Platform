"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Wallet, Tag, Shield, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("razorpay")
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; type: string } | null>(null)
  const [useWallet, setUseWallet] = useState(false)
  const [walletAmount, setWalletAmount] = useState(0)
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "processing" | "success">("pending")

  // Mock booking data
  const booking = {
    service: "Home Cleaning - Professional",
    basePrice: 999,
    addOns: [
      { name: "Deep cleaning", price: 200 },
      { name: "Window cleaning", price: 150 },
    ],
    date: "Tomorrow, 10:00 AM",
    address: "123 Green Street, Mumbai",
  }

  const availableCoupons = [
    { code: "WELCOME20", discount: 20, type: "flat", minAmount: 500, active: true },
    { code: "SAVE50", discount: 50, type: "flat", minAmount: 1000, active: true },
    { code: "REFER10", discount: 10, type: "percentage", minAmount: 0, active: true },
  ]

  const walletBalance = 500

  // Calculate totals
  const subtotal = booking.basePrice + booking.addOns.reduce((sum, addon) => sum + addon.price, 0)
  const discount = appliedCoupon
    ? appliedCoupon.type === "flat"
      ? appliedCoupon.discount
      : Math.round(subtotal * (appliedCoupon.discount / 100))
    : 0
  const walletDeduction = useWallet ? Math.min(walletAmount, subtotal - discount) : 0
  const total = Math.max(0, subtotal - discount - walletDeduction)

  const handleApplyCoupon = () => {
    const coupon = availableCoupons.find((c) => c.code === couponCode && c.active && c.minAmount <= subtotal)
    if (coupon) {
      setAppliedCoupon(coupon)
      alert(
        `Coupon applied! You saved ₹${coupon.type === "flat" ? coupon.discount : Math.round(subtotal * (coupon.discount / 100))}`,
      )
    } else {
      alert("Invalid or ineligible coupon code")
    }
  }

  const handlePayment = () => {
    setPaymentStatus("processing")
    setTimeout(() => {
      setPaymentStatus("success")
    }, 2000)
  }

  if (paymentStatus === "success") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <CardTitle>Payment Successful!</CardTitle>
            <CardDescription>Your booking is confirmed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-left space-y-2">
              <p>
                <strong>Order ID:</strong> #ORD123456
              </p>
              <p>
                <strong>Amount Paid:</strong> ₹{total}
              </p>
              <p>
                <strong>Service:</strong> {booking.service}
              </p>
              <p>
                <strong>Date:</strong> {booking.date}
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg text-sm">
              <p className="text-blue-800 dark:text-blue-200">
                Your worker will be assigned shortly. You'll receive a notification with their details and real-time
                location tracking.
              </p>
            </div>
            <Button asChild className="w-full">
              <Link href="/dashboard/orders">View My Bookings</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Checkout</h1>
        <p className="text-muted-foreground">Review and complete your booking</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Checkout Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-semibold">{booking.service}</p>
                <p className="text-sm text-muted-foreground">{booking.date}</p>
                <p className="text-sm text-muted-foreground">{booking.address}</p>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>{booking.service}</span>
                  <span>₹{booking.basePrice}</span>
                </div>
                {booking.addOns.map((addon) => (
                  <div key={addon.name} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{addon.name}</span>
                    <span>₹{addon.price}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Coupon Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Apply Coupon
              </CardTitle>
              <CardDescription>Use a discount code to save money</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {appliedCoupon && (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Coupon {appliedCoupon.code} applied! Saving ₹
                    {appliedCoupon.type === "flat"
                      ? appliedCoupon.discount
                      : Math.round(subtotal * (appliedCoupon.discount / 100))}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                <Input
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  disabled={!!appliedCoupon}
                />
                <Button onClick={handleApplyCoupon} disabled={!!appliedCoupon}>
                  Apply
                </Button>
              </div>

              <div className="text-sm">
                <p className="font-semibold mb-2">Available Coupons:</p>
                <div className="space-y-2">
                  {availableCoupons
                    .filter((c) => c.active && c.minAmount <= subtotal)
                    .map((coupon) => (
                      <button
                        key={coupon.code}
                        onClick={() => {
                          setCouponCode(coupon.code)
                        }}
                        className="w-full text-left p-2 rounded border hover:bg-muted"
                      >
                        <Badge className="mb-1">{coupon.code}</Badge>
                        <p className="text-xs">Save ₹{coupon.type === "flat" ? coupon.discount : "10%"}</p>
                      </button>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Wallet Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                Wallet Balance
              </CardTitle>
              <CardDescription>Use your wallet credits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-primary/10 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Available Balance</p>
                <p className="text-2xl font-bold text-primary">₹{walletBalance}</p>
              </div>

              <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useWallet}
                  onChange={(e) => {
                    setUseWallet(e.target.checked)
                    if (e.target.checked) {
                      setWalletAmount(Math.min(walletBalance, subtotal - discount))
                    } else {
                      setWalletAmount(0)
                    }
                  }}
                />
                <div className="flex-1">
                  <p className="font-semibold">Use Wallet</p>
                  <p className="text-sm text-muted-foreground">Deduct ₹{walletAmount} from your wallet balance</p>
                </div>
              </label>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="razorpay" id="razorpay" />
                    <label htmlFor="razorpay" className="flex-1 font-semibold cursor-pointer">
                      Razorpay (Credit Card / Debit Card / UPI)
                    </label>
                  </label>
                  <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="upi" id="upi" />
                    <label htmlFor="upi" className="flex-1 font-semibold cursor-pointer">
                      Direct UPI Transfer
                    </label>
                  </label>
                  <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="netbanking" id="netbanking" />
                    <label htmlFor="netbanking" className="flex-1 font-semibold cursor-pointer">
                      Net Banking
                    </label>
                  </label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        {/* Price Summary Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4 space-y-0">
            <CardHeader>
              <CardTitle>Price Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                {useWallet && walletDeduction > 0 && (
                  <div className="flex justify-between text-blue-600">
                    <span>Wallet</span>
                    <span>-₹{walletDeduction}</span>
                  </div>
                )}
              </div>

              <div className="border-t pt-4 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">₹{total}</span>
              </div>

              <Button size="lg" className="w-full" onClick={handlePayment} disabled={paymentStatus === "processing"}>
                {paymentStatus === "processing" ? "Processing..." : "Proceed to Payment"}
              </Button>

              <p className="text-xs text-muted-foreground text-center">Secure payment powered by Razorpay</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
