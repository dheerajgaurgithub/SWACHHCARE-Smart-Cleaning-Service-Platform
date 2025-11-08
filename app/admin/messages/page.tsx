"use client"

import { useState } from "react"
import { Mail, Send, Archive } from "lucide-react"

interface Message {
  _id: string
  name: string
  email: string
  subject: string
  message: string
  date: string
  read: boolean
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      _id: "1",
      name: "John Doe",
      email: "john@example.com",
      subject: "Service Quality Feedback",
      message: "The cleaning service was excellent. The worker was professional and thorough.",
      date: "2024-01-08",
      read: false,
    },
    {
      _id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      subject: "Complaint",
      message: "The worker did not show up for the scheduled appointment.",
      date: "2024-01-07",
      read: true,
    },
  ])
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [reply, setReply] = useState("")

  const handleMarkRead = (id: string) => {
    setMessages(messages.map((m) => (m._id === id ? { ...m, read: true } : m)))
  }

  const handleSendReply = async () => {
    if (selectedMessage) {
      console.log("Sending reply to:", selectedMessage.email)
      setReply("")
      setSelectedMessage(null)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Contact Messages</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {messages.length > 0 ? (
              <div>
                {messages.map((msg) => (
                  <button
                    key={msg._id}
                    onClick={() => {
                      setSelectedMessage(msg)
                      handleMarkRead(msg._id)
                    }}
                    className={`w-full text-left p-4 border-b border-gray-200 hover:bg-gray-50 smooth-transition ${
                      selectedMessage?._id === msg._id ? "bg-emerald-50" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className={`font-semibold ${msg.read ? "text-gray-900" : "text-emerald-600 font-bold"}`}>
                        {msg.name}
                      </h3>
                      {!msg.read && <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>}
                    </div>
                    <p className="text-sm text-gray-600 truncate">{msg.subject}</p>
                    <p className="text-xs text-gray-400 mt-1">{msg.date}</p>
                  </button>
                ))}
              </div>
            ) : (
              <p className="p-4 text-gray-600 text-center">No messages</p>
            )}
          </div>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedMessage.subject}</h2>
                <div className="flex items-center justify-between text-gray-600 text-sm">
                  <div>
                    <p className="font-medium">{selectedMessage.name}</p>
                    <p className="text-gray-500">{selectedMessage.email}</p>
                  </div>
                  <p>{selectedMessage.date}</p>
                </div>
              </div>

              <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-900 leading-relaxed">{selectedMessage.message}</p>
              </div>

              {/* Reply Section */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Send Reply</label>
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Type your reply here..."
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                ></textarea>
                <div className="flex gap-3">
                  <button
                    onClick={handleSendReply}
                    className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 flex items-center gap-2"
                  >
                    <Send size={18} />
                    Send Reply
                  </button>
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Archive size={18} />
                    Archive
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <Mail size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Select a message to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
