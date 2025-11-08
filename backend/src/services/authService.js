const User = require("../models/User")
const { generateToken, generateRefreshToken } = require("../config/jwt")
const crypto = require("crypto")

class AuthService {
  async registerCustomer(data) {
    const { name, email, phone, password } = data

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] })
    if (existingUser) {
      throw new Error("User already exists")
    }

    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: "customer",
    })

    const token = generateToken(user._id, user.role)
    const refreshToken = generateRefreshToken(user._id)

    return {
      user: { id: user._id, email: user.email, name: user.name, role: user.role },
      token,
      refreshToken,
    }
  }

  async registerWorker(data) {
    const { name, email, phone, password, skills } = data

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] })
    if (existingUser) {
      throw new Error("User already exists")
    }

    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: "worker",
    })

    // Create worker profile
    const Worker = require("../models/Worker")
    await Worker.create({
      userId: user._id,
      skills: skills || [],
      approvalStatus: "pending",
    })

    const token = generateToken(user._id, user.role)
    const refreshToken = generateRefreshToken(user._id)

    return {
      user: { id: user._id, email: user.email, name: user.name, role: user.role },
      token,
      refreshToken,
    }
  }

  async login(email, password) {
    const user = await User.findOne({ email })
    if (!user || !(await user.comparePassword(password))) {
      throw new Error("Invalid credentials")
    }

    if (user.isBlocked) {
      throw new Error("User is blocked")
    }

    user.lastLogin = new Date()
    await user.save()

    const token = generateToken(user._id, user.role)
    const refreshToken = generateRefreshToken(user._id)

    return {
      user: { id: user._id, email: user.email, name: user.name, role: user.role },
      token,
      refreshToken,
    }
  }

  async sendOTP(identifier) {
    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    })

    if (!user) {
      throw new Error("User not found")
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    user.otpCode = otpCode
    user.otpExpiry = otpExpiry
    await user.save()

    // TODO: Send OTP via email/SMS
    console.log(`[OTP] ${identifier}: ${otpCode}`)

    return { message: "OTP sent successfully" }
  }

  async verifyOTP(identifier, otpCode) {
    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    })

    if (!user) {
      throw new Error("User not found")
    }

    if (user.otpCode !== otpCode || new Date() > user.otpExpiry) {
      throw new Error("Invalid or expired OTP")
    }

    user.isVerified = true
    user.otpCode = undefined
    user.otpExpiry = undefined
    await user.save()

    const token = generateToken(user._id, user.role)
    return { token, message: "OTP verified successfully" }
  }

  async forgotPassword(email) {
    const user = await User.findOne({ email })
    if (!user) {
      throw new Error("User not found")
    }

    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex")
    user.resetTokenExpiry = new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
    await user.save()

    // TODO: Send reset email
    return { message: "Reset link sent to email" }
  }

  async resetPassword(token, newPassword) {
    const resetTokenHash = crypto.createHash("sha256").update(token).digest("hex")

    const user = await User.findOne({
      resetTokenExpiry: { $gt: new Date() },
    })

    if (!user) {
      throw new Error("Invalid or expired reset token")
    }

    user.password = newPassword
    user.resetTokenExpiry = undefined
    await user.save()

    return { message: "Password reset successfully" }
  }
}

module.exports = new AuthService()
