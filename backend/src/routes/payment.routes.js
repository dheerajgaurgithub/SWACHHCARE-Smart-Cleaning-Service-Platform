const express = require("express")
const paymentController = require("../controllers/paymentController")
const { auth } = require("../middlewares/auth")
const validate = require("../middlewares/validate")
const paymentValidator = require("../validators/paymentValidator")

const router = express.Router()

router.post("/create-order", auth, validate(paymentValidator.createOrder), paymentController.createOrder)
router.post("/verify", auth, validate(paymentValidator.verifyPayment), paymentController.verifyPayment)
router.post("/payout", auth, validate(paymentValidator.payout), paymentController.processWorkerPayout)

module.exports = router
