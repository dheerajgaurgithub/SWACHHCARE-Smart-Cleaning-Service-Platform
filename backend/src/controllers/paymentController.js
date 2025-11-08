const paymentService = require("../services/paymentService")

class PaymentController {
  async createOrder(req, res, next) {
    try {
      const { bookingId, amount } = req.body
      const result = await paymentService.createOrder(bookingId, amount)
      res.status(201).json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  async verifyPayment(req, res, next) {
    try {
      const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body
      const payment = await paymentService.verifyPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature)
      res.status(200).json({ success: true, data: payment })
    } catch (error) {
      next(error)
    }
  }

  async processWorkerPayout(req, res, next) {
    try {
      const { workerId, amount } = req.body
      const transaction = await paymentService.processWorkerPayout(workerId, amount)
      res.status(200).json({ success: true, data: transaction })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new PaymentController()
