"use client"

import { useEffect, useRef } from "react"
import type { Socket } from "socket.io-client"
import { getSocket, disconnectSocket } from "@/lib/socket-client"

export function useSocket() {
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    socketRef.current = getSocket()

    return () => {
      // Don't disconnect on unmount, keep connection alive
    }
  }, [])

  const emit = (event: string, data?: any) => {
    if (socketRef.current) {
      socketRef.current.emit(event, data)
    }
  }

  const on = (event: string, callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback)
    }
  }

  const off = (event: string, callback?: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback)
    }
  }

  const disconnect = () => {
    disconnectSocket()
  }

  return { emit, on, off, disconnect, socket: socketRef.current }
}
