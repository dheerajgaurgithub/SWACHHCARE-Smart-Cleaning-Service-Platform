const express = require("express")
const bookingController = require("../controllers/bookingController")
const { auth } = require("../middlewares/auth")
const validate = require("../middlewares/validate")
const bookingValidator = require("../validators/bookingValidator")

const router = express.Router()

router.post("/", auth, validate(bookingValidator.createBooking), bookingController.createBooking)
router.get("/", auth, bookingController.getBookings)
router.get("/:bookingId", auth, bookingController.getBooking)
router.put("/:bookingId/status", auth, validate(bookingValidator.updateStatus), bookingController.updateStatus)
router.post("/:bookingId/assign", auth, validate(bookingValidator.assignWorker), bookingController.assignWorker)
router.post("/:bookingId/feedback", auth, validate(bookingValidator.addFeedback), bookingController.addFeedback)
router.post("/:bookingId/cancel", auth, validate(bookingValidator.cancelBooking), bookingController.cancelBooking)

module.exports = router
