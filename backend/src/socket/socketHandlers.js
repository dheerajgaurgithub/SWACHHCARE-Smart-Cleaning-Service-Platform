const setupSocketHandlers = (io) => {
  const activeUsers = new Map()

  io.on("connection", (socket) => {
    console.log("[Socket] User connected:", socket.id)

    socket.on("user-joined", (userId) => {
      activeUsers.set(socket.id, userId)
      io.emit("user-status", {
        userId,
        status: "online",
      })
    })

    // Chat events
    socket.on("join-chat", (conversationId) => {
      socket.join(`chat-${conversationId}`)
    })

    socket.on("send-message", (data) => {
      io.to(`chat-${data.conversationId}`).emit("new-message", data)
    })

    socket.on("typing", (data) => {
      io.to(`chat-${data.conversationId}`).emit("user-typing", data)
    })

    // Booking tracking
    socket.on("join-booking", (bookingId) => {
      socket.join(`booking-${bookingId}`)
    })

    socket.on("location-update", (data) => {
      io.to(`booking-${data.bookingId}`).emit("worker-location", data)
    })

    socket.on("disconnect", () => {
      const userId = activeUsers.get(socket.id)
      activeUsers.delete(socket.id)
      console.log("[Socket] User disconnected:", socket.id)
      if (userId) {
        io.emit("user-status", {
          userId,
          status: "offline",
        })
      }
    })
  })

  return io
}

module.exports = { setupSocketHandlers }
