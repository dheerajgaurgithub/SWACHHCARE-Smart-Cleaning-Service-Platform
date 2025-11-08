require("dotenv").config()
const express = require("express")
const http = require("http")
const socketIo = require("socket.io")
const cors = require("cors")
const helmet = require("helmet")
const compression = require("compression")
const mongoSanitize = require("express-mongo-sanitize")
const rateLimit = require("express-rate-limit")
const winston = require("winston")
const mongoose = require("mongoose")

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log("MongoDB connected")
  } catch (error) {
    console.error("MongoDB connection error:", error)
    process.exit(1)
  }
}

const app = express()
const server = http.createServer(app)
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
})

// Logger setup
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
})

// Security Middleware
app.use(helmet())
app.use(mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    logger.warn(`Request contained not allowed property: ${key}`, { url: req.originalUrl });
  },
}));
app.use(compression())

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
})
app.use(limiter)

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
)

// Body Parser
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ limit: "50mb", extended: true }))

// Connect Database
connectDB()

// Health Check
app.get("/healthz", (req, res) => {
  res.json({ status: "OK", timestamp: new Date() })
})

// Routes
app.use("/api/v1/auth", require("./routes/auth"))
app.use("/api/v1/users", require("./routes/users"))
app.use("/api/v1/workers", require("./routes/workers"))
app.use("/api/v1/bookings", require("./routes/bookings"))
app.use("/api/v1/payments", require("./routes/payments"))
app.use("/api/v1/transactions", require("./routes/transactions"))
app.use("/api/v1/admin", require("./routes/admin"))
app.use("/api/v1/contact", require("./routes/contact"))
app.use("/api/v1/chat", require("./routes/chat"))

// Socket.io Setup
const { setupSocketHandlers } = require("./src/socket/socketHandlers")
setupSocketHandlers(io)
app.set("io", io)

// Error Handler Middleware
const errorHandler = require("./src/middlewares/errorHandler")
app.use(errorHandler)

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" })
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
  console.log(`Backend running on http://localhost:${PORT}`)
})

module.exports = { app, server, io }
