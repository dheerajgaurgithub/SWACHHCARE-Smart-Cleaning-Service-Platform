"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp, DollarSign, Calendar } from "lucide-react"

export default function EarningsPage() {
  const earningsData = [
    { month: "Jan 8", earnings: 1500 },
    { month: "Jan 9", earnings: 2000 },
    { month: "Jan 10", earnings: 1800 },
    { month: "Jan 11", earnings: 2500 },
    { month: "Jan 12", earnings: 1600 },
    { month: "Jan 13", earnings: 3000 },
    { month: "Jan 14", earnings: 2200 },
  ]

  const earnings = [
    {
      period: "Today",
      amount: "₹2,498",
      tasks: 2,
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      period: "This Week",
      amount: "₹14,700",
      tasks: 14,
      icon: Calendar,
      color: "text-blue-600",
    },
    {
      period: "This Month",
      amount: "₹45,300",
      tasks: 42,
      icon: TrendingUp,
      color: "text-purple-600",
    },
  ]

  const transactions = [
    { date: "Jan 14", description: "Home Cleaning - Rahul Sharma", amount: "₹999" },
    { date: "Jan 14", description: "Laundry Service - Priya Singh", amount: "₹499" },
    { date: "Jan 13", description: "Car Wash - Amit Patel", amount: "₹599" },
    { date: "Jan 13", description: "Home Cleaning - Neha Gupta", amount: "₹1,499" },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Earnings</h1>
        <p className="text-muted-foreground">Track your income and payment history</p>
      </div>

      {/* Earnings Summary */}
      <div className="grid md:grid-cols-3 gap-6">
        {earnings.map((item) => {
          const Icon = item.icon
          return (
            <Card key={item.period}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{item.period}</CardTitle>
                <Icon className={`${item.color} w-4 h-4`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{item.amount}</div>
                <p className="text-xs text-muted-foreground mt-1">{item.tasks} tasks completed</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Earnings Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Earnings</CardTitle>
          <CardDescription>Your earnings over the past week</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={earningsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="earnings" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Payment Information */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle>Payment Information</CardTitle>
          <CardDescription>Your payment method and account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Bank Account</p>
            <p className="font-semibold">SBI - XXXX XXXX XXXX 4567</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Next Payment Date</p>
            <p className="font-semibold">January 17, 2025</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Pending Amount</p>
            <p className="font-semibold text-lg">₹2,498</p>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your earnings from completed tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.map((tx, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div>
                  <p className="font-medium">{tx.description}</p>
                  <p className="text-sm text-muted-foreground">{tx.date}</p>
                </div>
                <p className="font-bold text-primary">{tx.amount}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
