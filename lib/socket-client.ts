import { io, type Socket } from "socket.io-client"

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000"

let socket: Socket | null = null

export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, {
      auth: {
        token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    })

    socket.on("connect", () => {
      console.log("[Socket] Connected to server")
    })

    socket.on("disconnect", () => {
      console.log("[Socket] Disconnected from server")
    })

    socket.on("error", (error) => {
      console.error("[Socket] Error:", error)
    })
  }

  return socket
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export const socketEvents = {
  // Chat events
  SEND_MESSAGE: "send_message",
  RECEIVE_MESSAGE: "receive_message",
  TYPING: "typing",
  STOP_TYPING: "stop_typing",

  // Notification events
  SEND_NOTIFICATION: "send_notification",
  RECEIVE_NOTIFICATION: "receive_notification",

  // Booking events
  BOOKING_UPDATE: "booking_update",
  WORKER_LOCATION: "worker_location",
  BOOKING_STATUS: "booking_status",

  // Availability events
  WORKER_AVAILABLE: "worker_available",
  WORKER_UNAVAILABLE: "worker_unavailable",
}
