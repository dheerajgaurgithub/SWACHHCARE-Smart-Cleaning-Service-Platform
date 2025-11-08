const express = require("express")
const workerController = require("../controllers/workerController")
const { auth, adminOnly, workerOnly } = require("../middlewares/auth")
const validate = require("../middlewares/validate")
const workerValidator = require("../validators/workerValidator")

const router = express.Router()

router.get("/", workerController.listWorkers)
router.get("/:workerId", workerController.getProfile)

router.put("/:workerId/approve", auth, adminOnly, workerController.approveWorker)
router.put("/:workerId/reject", auth, adminOnly, workerController.rejectWorker)

router.put(
  "/me/availability",
  auth,
  workerOnly,
  validate(workerValidator.updateAvailability),
  workerController.updateAvailability,
)
router.post(
  "/me/attendance",
  auth,
  workerOnly,
  validate(workerValidator.recordAttendance),
  workerController.recordAttendance,
)
router.post(
  "/me/payout-request",
  auth,
  workerOnly,
  validate(workerValidator.requestPayout),
  workerController.requestPayout,
)
router.put("/me/skills", auth, workerOnly, validate(workerValidator.updateSkills), workerController.updateSkills)

module.exports = router
