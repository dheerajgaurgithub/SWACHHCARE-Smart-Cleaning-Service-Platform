const Joi = require("joi")

const paymentValidator = {
  createOrder: Joi.object({
    bookingId: Joi.string().required(),
    amount: Joi.number().required(),
  }),

  verifyPayment: Joi.object({
    razorpayOrderId: Joi.string().required(),
    razorpayPaymentId: Joi.string().required(),
    razorpaySignature: Joi.string().required(),
  }),

  payout: Joi.object({
    workerId: Joi.string().required(),
    amount: Joi.number().required(),
  }),
}

module.exports = paymentValidator
