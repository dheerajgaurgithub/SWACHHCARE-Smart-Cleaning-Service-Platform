"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Phone, Clock, User } from "lucide-react"

export default function TasksPage() {
  const [tasks, setTasks] = useState([
    {
      id: "TASK-001",
      customer: "Rahul Sharma",
      phone: "+91-9876543210",
      service: "Home Cleaning",
      date: "Jan 15, 2025",
      time: "10:00 AM - 2:00 PM",
      location: "123 Green Street, Mumbai, 400001",
      status: "Confirmed",
      amount: "₹999",
      notes: "Please bring eco-friendly cleaning supplies",
    },
    {
      id: "TASK-002",
      customer: "Priya Singh",
      phone: "+91-9123456789",
      service: "Laundry Service",
      date: "Jan 15, 2025",
      time: "2:00 PM - 4:00 PM",
      location: "456 Maple Avenue, Mumbai, 400002",
      status: "Assigned",
      amount: "₹499",
      notes: "Delicate clothes, handle with care",
    },
    {
      id: "TASK-003",
      customer: "Amit Patel",
      phone: "+91-9988776655",
      service: "Car Wash",
      date: "Jan 16, 2025",
      time: "9:00 AM - 11:00 AM",
      location: "789 Oak Road, Mumbai, 400003",
      status: "Pending",
      amount: "₹599",
      notes: "Full interior and exterior cleaning",
    },
    {
      id: "TASK-004",
      customer: "Neha Gupta",
      phone: "+91-9111222333",
      service: "Home Cleaning",
      date: "Jan 14, 2025",
      time: "3:00 PM - 7:00 PM",
      status: "Completed",
      location: "321 Pine Lane, Mumbai, 400004",
      amount: "₹1,499",
      notes: "Deep cleaning - bathroom and kitchen",
    },
  ])

  const updateTaskStatus = (taskId: string, newStatus: string) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)))
    alert(`Task status updated to: ${newStatus}`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800"
      case "Confirmed":
        return "bg-blue-100 text-blue-800"
      case "Assigned":
        return "bg-purple-100 text-purple-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const activeTab = (status: string) => {
    switch (status) {
      case "Confirmed":
      case "Assigned":
      case "Pending":
        return "active"
      case "Completed":
        return "completed"
      default:
        return "active"
    }
  }

  const filterTasks = (tab: string) => {
    return tasks.filter((task) => {
      if (tab === "active") {
        return ["Confirmed", "Assigned", "Pending"].includes(task.status)
      }
      return task.status === "Completed"
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">My Tasks</h1>
        <p className="text-muted-foreground">Manage your assigned services and track progress</p>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList>
          <TabsTrigger value="active">Active Tasks ({filterTasks("active").length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({filterTasks("completed").length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {filterTasks("active").length > 0 ? (
            filterTasks("active").map((task) => (
              <Card key={task.id} className="overflow-hidden">
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Task Info */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">{task.id}</p>
                          <h3 className="text-2xl font-bold">{task.service}</h3>
                        </div>
                        <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-muted-foreground" />
                          <span>{task.customer}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone size={16} className="text-muted-foreground" />
                          <span>{task.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-muted-foreground" />
                          <span>
                            {task.date} • {task.time}
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin size={16} className="text-muted-foreground flex-shrink-0 mt-0.5" />
                          <span>{task.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Notes & Details */}
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-xs text-muted-foreground font-medium mb-2">TASK NOTES</p>
                      <p className="text-sm">{task.notes}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">EARNING</p>
                        <p className="text-3xl font-bold text-primary">{task.amount}</p>
                      </div>
                      <div className="space-y-2">
                        {task.status === "Assigned" && (
                          <Button className="w-full" onClick={() => updateTaskStatus(task.id, "Confirmed")}>
                            Accept Task
                          </Button>
                        )}
                        {task.status === "Confirmed" && (
                          <Button className="w-full" onClick={() => updateTaskStatus(task.id, "Completed")}>
                            Mark Complete
                          </Button>
                        )}
                        {task.status === "Pending" && (
                          <Button className="w-full" onClick={() => updateTaskStatus(task.id, "Confirmed")}>
                            Accept
                          </Button>
                        )}
                        <Button variant="outline" className="w-full bg-transparent">
                          Contact Customer
                        </Button>
                        <Button variant="destructive" className="w-full">
                          Decline
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <p className="text-muted-foreground">No active tasks at the moment</p>
                <p className="text-sm text-muted-foreground mt-1">Come back later for new opportunities</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {filterTasks("completed").length > 0 ? (
            filterTasks("completed").map((task) => (
              <Card key={task.id} className="opacity-75">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{task.id}</p>
                      <h3 className="text-xl font-bold">{task.service}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{task.customer}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{task.amount}</p>
                      <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <p className="text-muted-foreground">No completed tasks yet</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
