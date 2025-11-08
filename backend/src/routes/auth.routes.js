const express = require("express")
const authController = require("../controllers/authController")
const validate = require("../middlewares/validate")
const authValidator = require("../validators/authValidator")

const router = express.Router()

router.post("/register", validate(authValidator.register), authController.registerCustomer)
router.post("/register-worker", validate(authValidator.registerWorker), authController.registerWorker)
router.post("/login", validate(authValidator.login), authController.login)
router.post("/otp/send", validate(authValidator.sendOTP), authController.sendOTP)
router.post("/otp/verify", validate(authValidator.verifyOTP), authController.verifyOTP)
router.post("/forgot-password", validate(authValidator.forgotPassword), authController.forgotPassword)
router.post("/reset-password", validate(authValidator.resetPassword), authController.resetPassword)

module.exports = router
