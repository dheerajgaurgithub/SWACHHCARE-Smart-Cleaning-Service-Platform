const authService = require("../services/authService")

class AuthController {
  async registerCustomer(req, res, next) {
    try {
      const result = await authService.registerCustomer(req.body)
      res.status(201).json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  async registerWorker(req, res, next) {
    try {
      const result = await authService.registerWorker(req.body)
      res.status(201).json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body
      const result = await authService.login(email, password)
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  async sendOTP(req, res, next) {
    try {
      const { identifier } = req.body
      const result = await authService.sendOTP(identifier)
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  async verifyOTP(req, res, next) {
    try {
      const { identifier, code } = req.body
      const result = await authService.verifyOTP(identifier, code)
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body
      const result = await authService.forgotPassword(email)
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  async resetPassword(req, res, next) {
    try {
      const { token, newPassword } = req.body
      const result = await authService.resetPassword(token, newPassword)
      res.status(200).json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new AuthController()
