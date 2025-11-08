"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { DollarSign, Users, Briefcase, TrendingUp } from "lucide-react"

export default function AdminDashboard() {
  const stats = [
    { label: "Total Revenue", value: "₹2,45,670", icon: DollarSign, color: "text-green-600" },
    { label: "Active Users", value: "156", icon: Users, color: "text-blue-600" },
    { label: "Total Services", value: "342", icon: Briefcase, color: "text-purple-600" },
    { label: "Growth Rate", value: "+24%", icon: TrendingUp, color: "text-orange-600" },
  ]

  const recentOrders = [
    { id: "ORD-001", customer: "Rahul Sharma", service: "Home Cleaning", status: "Completed", amount: "₹999" },
    { id: "ORD-002", customer: "Priya Singh", service: "Laundry", status: "Completed", amount: "₹499" },
    { id: "ORD-003", customer: "Amit Patel", service: "Car Wash", status: "Scheduled", amount: "₹599" },
    { id: "ORD-004", customer: "Neha Gupta", service: "Home Cleaning", status: "Scheduled", amount: "₹1,499" },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome to SWACHHCARE management panel</p>
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

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <CardTitle>Platform Status</CardTitle>
            <CardDescription>System health and performance metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Server Status</span>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Response Time</span>
              <span className="font-semibold">120ms</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Active Users</span>
              <span className="font-semibold">42</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common admin tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start bg-transparent">
              Send System Notification
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              Export Report
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              Manage Disputes
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest service bookings</CardDescription>
            </div>
            <Button variant="outline" asChild>
              <Link href="/admin/services">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-2">Order ID</th>
                  <th className="text-left py-2 px-2">Customer</th>
                  <th className="text-left py-2 px-2">Service</th>
                  <th className="text-left py-2 px-2">Status</th>
                  <th className="text-left py-2 px-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-muted/50">
                    <td className="py-2 px-2 font-semibold">{order.id}</td>
                    <td className="py-2 px-2">{order.customer}</td>
                    <td className="py-2 px-2">{order.service}</td>
                    <td className="py-2 px-2">
                      <Badge variant={order.status === "Completed" ? "default" : "outline"}>{order.status}</Badge>
                    </td>
                    <td className="py-2 px-2 font-semibold text-primary">{order.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
