"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { CheckCircle2, Clock, TrendingUp, AlertCircle } from "lucide-react"

export default function WorkerDashboard() {
  // Mock data
  const stats = [
    { label: "Active Tasks", value: "3", icon: Clock, color: "text-blue-600" },
    { label: "Completed Today", value: "2", icon: CheckCircle2, color: "text-green-600" },
    { label: "Total Earnings", value: "₹4,500", icon: TrendingUp, color: "text-purple-600" },
    { label: "Rating", value: "4.8", icon: AlertCircle, color: "text-yellow-600" },
  ]

  const upcomingTasks = [
    {
      id: 1,
      customer: "Rahul Sharma",
      service: "Home Cleaning",
      date: "Today, 10:00 AM",
      location: "Green Street, Mumbai",
      status: "Confirmed",
      amount: "₹999",
    },
    {
      id: 2,
      customer: "Priya Singh",
      service: "Laundry Service",
      date: "Today, 2:00 PM",
      location: "Maple Avenue, Mumbai",
      status: "Assigned",
      amount: "₹499",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Welcome back, Raj!</h1>
        <p className="text-muted-foreground">Here's your work summary for today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <Icon className={`${stat.color} w-4 h-4`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Availability Status */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle>Your Availability</CardTitle>
          <CardDescription>Set your working hours and availability status</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Current Status</p>
            <p className="text-lg font-semibold text-green-600">Available for work</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Go Offline</Button>
            <Button asChild>
              <Link href="/worker/profile">Manage Hours</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Tasks */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Upcoming Tasks</CardTitle>
              <CardDescription>Your scheduled services for today</CardDescription>
            </div>
            <Button variant="outline" asChild>
              <Link href="/worker/tasks">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingTasks.map((task) => (
              <div key={task.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold">{task.service}</p>
                    <p className="text-sm text-muted-foreground">Customer: {task.customer}</p>
                  </div>
                  <Badge variant={task.status === "Confirmed" ? "default" : "outline"}>{task.status}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="text-muted-foreground">
                    <p>{task.date}</p>
                    <p>{task.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">{task.amount}</p>
                    <Button size="sm" className="mt-2">
                      Start Task
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
