import express, { type Express, type Request, type Response } from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"
import authRoutes from "./routes/auth"
import bookingRoutes from "./routes/bookings"
import workerRoutes from "./routes/workers"
import paymentRoutes from "./routes/payments"
import packageRoutes from "./routes/packages"
import jobRoutes from "./routes/jobs"
import { errorHandler } from "./middleware/errorHandler"
import { requestLogger } from "./middleware/auth"

dotenv.config()

const app: Express = express()
const PORT = process.env.PORT || 5000
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/swachhcare"

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(requestLogger)

// MongoDB Connection
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Health Check
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() })
})

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/bookings", bookingRoutes)
app.use("/api/workers", workerRoutes)
app.use("/api/payments", paymentRoutes)
app.use("/api/packages", packageRoutes)
app.use("/api/jobs", jobRoutes)

// Error Handler
app.use(errorHandler)

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

export default app
