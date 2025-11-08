const { verifyToken } = require("../config/jwt")
const User = require("../models/User")

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return res.status(401).json({ success: false, message: "Invalid token" })
    }

    const user = await User.findById(decoded.userId)
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    req.user = user
    req.token = token
    next()
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Admin access required" })
  }
  next()
}

const workerOnly = (req, res, next) => {
  if (req.user.role !== "worker") {
    return res.status(403).json({ success: false, message: "Worker access required" })
  }
  next()
}

const customerOnly = (req, res, next) => {
  if (req.user.role !== "customer") {
    return res.status(403).json({ success: false, message: "Customer access required" })
  }
  next()
}

module.exports = { auth, adminOnly, workerOnly, customerOnly }
