const userService = require("../services/userService")

class UserController {
  async getProfile(req, res, next) {
    try {
      const user = await userService.getUserProfile(req.user._id)
      res.status(200).json({ success: true, data: user })
    } catch (error) {
      next(error)
    }
  }

  async updateProfile(req, res, next) {
    try {
      const user = await userService.updateUserProfile(req.user._id, req.body)
      res.status(200).json({ success: true, data: user })
    } catch (error) {
      next(error)
    }
  }

  async changePassword(req, res, next) {
    try {
      const { oldPassword, newPassword } = req.body
      const result = await userService.changePassword(req.user._id, oldPassword, newPassword)
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  async addAddress(req, res, next) {
    try {
      const user = await userService.addAddress(req.user._id, req.body)
      res.status(201).json({ success: true, data: user })
    } catch (error) {
      next(error)
    }
  }

  async deleteAddress(req, res, next) {
    try {
      const { addressId } = req.params
      const user = await userService.deleteAddress(req.user._id, addressId)
      res.status(200).json({ success: true, data: user })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new UserController()
