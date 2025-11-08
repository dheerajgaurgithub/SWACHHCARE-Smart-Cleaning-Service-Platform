"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useSocket } from "@/lib/hooks/use-socket"
import { useAuth } from "@/hooks/use-auth"
import { Send } from "lucide-react"

interface Message {
  id: string
  senderId: string
  senderName: string
  text: string
  timestamp: Date
}

interface ChatWindowProps {
  conversationId: string
  otherUserId: string
  otherUserName: string
}

export default function ChatWindow({ conversationId, otherUserId, otherUserName }: ChatWindowProps) {
  const { user } = useAuth()
  const { emit, on, off } = useSocket()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    // Join conversation room
    emit("join_conversation", { conversationId })

    // Listen for incoming messages
    on("receive_message", (message: Message) => {
      setMessages((prev) => [...prev, message])
    })

    // Listen for typing indicator
    on("typing", () => {
      setIsTyping(true)
    })

    on("stop_typing", () => {
      setIsTyping(false)
    })

    return () => {
      off("receive_message")
      off("typing")
      off("stop_typing")
    }
  }, [conversationId])

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !user) return

    const message: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      senderName: user.name,
      text: newMessage,
      timestamp: new Date(),
    }

    emit("send_message", {
      conversationId,
      message,
    })

    setMessages((prev) => [...prev, message])
    setNewMessage("")
    emit("stop_typing")
  }

  const handleTyping = () => {
    emit("typing", { conversationId })

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      emit("stop_typing", { conversationId })
    }, 3000)
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">{otherUserName}</h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.senderId === user?.id ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                msg.senderId === user?.id
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
              }`}
            >
              <p className="text-sm">{msg.text}</p>
              <p className="text-xs opacity-70 mt-1">{new Date(msg.timestamp).toLocaleTimeString()}</p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 italic">
              {otherUserName} is typing...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value)
              handleTyping()
            }}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 smooth-transition"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  )
}
