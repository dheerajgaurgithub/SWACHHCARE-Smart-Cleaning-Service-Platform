const Payment = require("../models/Payment")
const Transaction = require("../models/Transaction")
const Booking = require("../models/Booking")
const Worker = require("../models/Worker")
const razorpay = require("../config/razorpay")
const crypto = require("crypto")
const nanoid = require("nanoid").nanoid

class PaymentService {
  async createOrder(bookingId, amount) {
    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: "INR",
      receipt: `receipt_${bookingId}`,
    }

    const order = await razorpay.orders.create(options)

    const payment = await Payment.create({
      bookingId,
      userId: (await Booking.findById(bookingId)).customerId,
      razorpayOrderId: order.id,
      amount,
      status: "pending",
    })

    return { order, payment }
  }

  async verifyPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature) {
    const payment = await Payment.findOne({ razorpayOrderId })
    if (!payment) throw new Error("Payment not found")

    // Verify signature
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET)
    hmac.update(razorpayOrderId + "|" + razorpayPaymentId)
    const digest = hmac.digest("hex")

    if (digest !== razorpaySignature) {
      throw new Error("Payment verification failed")
    }

    payment.razorpayPaymentId = razorpayPaymentId
    payment.razorpaySignature = razorpaySignature
    payment.status = "captured"
    await payment.save()

    // Create transaction
    const transactionId = `TXN-${nanoid(10).toUpperCase()}`
    await Transaction.create({
      transactionId,
      userId: payment.userId,
      bookingId: payment.bookingId,
      type: "payment",
      amount: payment.amount,
      status: "completed",
    })

    // Update booking status
    await Booking.findByIdAndUpdate(payment.bookingId, { paymentStatus: "completed" })

    return payment
  }

  async processWorkerPayout(workerId, amount) {
    const worker = await Worker.findById(workerId)
    if (!worker) throw new Error("Worker not found")

    // Calculate commission
    const AdminSettings = require("../models/AdminSettings")
    const settings = await AdminSettings.findOne({})
    const commissionPercentage = settings?.platformCommission || 20
    const commission = (amount * commissionPercentage) / 100
    const workerAmount = amount - commission

    const transactionId = `TXN-${nanoid(10).toUpperCase()}`
    const payoutTransaction = await Transaction.create({
      transactionId,
      workerId,
      type: "payout",
      amount: workerAmount,
      commission,
      commissionPercentage,
      status: "completed",
    })

    worker.pendingPayouts -= amount
    worker.totalEarnings += workerAmount
    await worker.save()

    return payoutTransaction
  }

  async creditWorkerWallet(workerId, bookingId, amount) {
    const worker = await Worker.findById(workerId)
    if (!worker) throw new Error("Worker not found")

    worker.walletBalance += amount
    await worker.save()

    return worker
  }
}

module.exports = new PaymentService()
