import type { Request, Response, NextFunction } from "express"

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("[v0] Error:", err)

  if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message })
  }

  if (err.name === "MongoError" && err.code === 11000) {
    return res.status(400).json({ error: "Duplicate field value" })
  }

  res.status(err.statusCode || 500).json({
    error: err.message || "Internal server error",
  })
}
