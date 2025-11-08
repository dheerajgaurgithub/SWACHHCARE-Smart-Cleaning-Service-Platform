const errorHandler = (error, req, res, next) => {
  console.error("[Error]", error)

  const status = error.status || 500
  const message = error.message || "Internal Server Error"

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  })
}

module.exports = errorHandler
