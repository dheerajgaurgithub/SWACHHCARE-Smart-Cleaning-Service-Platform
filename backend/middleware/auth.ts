import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

declare global {
  namespace Express {
    interface Request {
      user?: any
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
      return res.status(401).json({ error: "No token provided" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret")
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" })
  }
}

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  console.log(`[v0] ${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
}
