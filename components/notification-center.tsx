"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, X, CheckCircle, AlertCircle, Info } from "lucide-react"

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "success",
      title: "Payment Successful",
      message: "Your booking payment of ₹999 has been confirmed",
      time: "5 min ago",
      read: false,
    },
    {
      id: 2,
      type: "info",
      title: "Worker Assigned",
      message: "Raj Kumar has been assigned to your booking",
      time: "3 min ago",
      read: false,
    },
    {
      id: 3,
      type: "alert",
      title: "ETA Update",
      message: "Your worker will arrive in 15 minutes",
      time: "1 min ago",
      read: false,
    },
    {
      id: 4,
      type: "success",
      title: "Offer Available",
      message: "New referral offer: Earn ₹500 for each friend",
      time: "1 hour ago",
      read: true,
    },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleMarkAsRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const handleClearAll = () => {
    setNotifications([])
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "alert":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />
      case "info":
      default:
        return <Info className="w-4 h-4 text-blue-600" />
    }
  }

  return (
    <div className="relative">
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="relative">
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-background border border-border rounded-lg shadow-lg z-50">
          <Card className="border-0 shadow-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Notifications</CardTitle>
                {unreadCount > 0 && <Badge className="mt-1">{unreadCount} unread</Badge>}
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>

            <CardContent className="max-h-96 overflow-y-auto space-y-2">
              {notifications.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No notifications</p>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors ${
                      notif.read ? "" : "bg-blue-50 dark:bg-blue-950/20 border-blue-200"
                    }`}
                    onClick={() => handleMarkAsRead(notif.id)}
                  >
                    <div className="flex gap-3">
                      {getIcon(notif.type)}
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{notif.title}</p>
                        <p className="text-xs text-muted-foreground">{notif.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>

            {notifications.length > 0 && (
              <div className="border-t p-2">
                <Button variant="ghost" size="sm" className="w-full text-xs" onClick={handleClearAll}>
                  Clear All
                </Button>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  )
}
