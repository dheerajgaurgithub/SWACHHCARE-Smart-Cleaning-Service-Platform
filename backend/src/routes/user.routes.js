const express = require("express")
const userController = require("../controllers/userController")
const { auth } = require("../middlewares/auth")
const validate = require("../middlewares/validate")
const userValidator = require("../validators/userValidator")

const router = express.Router()

router.get("/me", auth, userController.getProfile)
router.put("/me", auth, validate(userValidator.updateProfile), userController.updateProfile)
router.put("/me/password", auth, validate(userValidator.changePassword), userController.changePassword)

router.post("/addresses", auth, validate(userValidator.addAddress), userController.addAddress)
router.delete("/addresses/:addressId", auth, userController.deleteAddress)

module.exports = router
