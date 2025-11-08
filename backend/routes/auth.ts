import express, { type Router, type Request, type Response } from "express"
import User from "../models/User"
import { generateAccessToken, generateRefreshToken } from "../utils/jwt"
import { verifyGoogleToken } from "../utils/googleOAuth"
import { authMiddleware } from "../middleware/auth"

const router: Router = express.Router()

// Register
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" })
    }

    const user = new User({ name, email, password, role })
    await user.save()

    const accessToken = generateAccessToken(user._id.toString(), role)
    const refreshToken = generateRefreshToken(user._id.toString())

    res.status(201).json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token: accessToken,
      refreshToken,
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const accessToken = generateAccessToken(user._id.toString(), user.role)
    const refreshToken = generateRefreshToken(user._id.toString())

    res.json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token: accessToken,
      refreshToken,
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Google Sign-In
router.post("/google", async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body
    const payload = await verifyGoogleToken(idToken)

    if (!payload || !payload.email) {
      return res.status(401).json({ error: "Invalid Google token" })
    }

    let user = await User.findOne({ email: payload.email })

    if (!user) {
      user = new User({
        name: payload.name,
        email: payload.email,
        googleId: payload.sub,
        role: "customer",
      })
      await user.save()
    }

    const accessToken = generateAccessToken(user._id.toString(), user.role)
    const refreshToken = generateRefreshToken(user._id.toString())

    res.json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token: accessToken,
      refreshToken,
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Get current user
router.get("/me", authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user.userId).select("-password")
    res.json({ success: true, user })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

export default router
