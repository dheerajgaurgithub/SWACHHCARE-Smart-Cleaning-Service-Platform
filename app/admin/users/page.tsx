"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, MoreVertical } from "lucide-react"

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const customers = [
    { id: 1, name: "Rahul Sharma", email: "rahul@example.com", status: "Active", orders: 12, joined: "2024-12-01" },
    { id: 2, name: "Priya Singh", email: "priya@example.com", status: "Active", orders: 8, joined: "2024-12-05" },
    { id: 3, name: "Amit Patel", email: "amit@example.com", status: "Inactive", orders: 5, joined: "2024-11-20" },
    { id: 4, name: "Neha Gupta", email: "neha@example.com", status: "Active", orders: 15, joined: "2024-10-15" },
  ]

  const workers = [
    {
      id: 1,
      name: "Raj Kumar",
      email: "raj@example.com",
      status: "Active",
      tasks: 42,
      rating: 4.8,
      joined: "2024-09-01",
    },
    {
      id: 2,
      name: "Priya Worker",
      email: "priya.w@example.com",
      status: "Active",
      tasks: 38,
      rating: 4.6,
      joined: "2024-09-10",
    },
    {
      id: 3,
      name: "Ajay Singh",
      email: "ajay@example.com",
      status: "Inactive",
      tasks: 25,
      rating: 4.3,
      joined: "2024-08-20",
    },
    {
      id: 4,
      name: "Kavita Sharma",
      email: "kavita@example.com",
      status: "Active",
      tasks: 52,
      rating: 4.9,
      joined: "2024-08-01",
    },
  ]

  const getStatusColor = (status: string) => {
    return status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Users Management</h1>
        <p className="text-muted-foreground">Manage customers and workers on the platform</p>
      </div>

      <Tabs defaultValue="customers" className="space-y-6">
        <TabsList>
          <TabsTrigger value="customers">Customers ({customers.length})</TabsTrigger>
          <TabsTrigger value="workers">Workers ({workers.length})</TabsTrigger>
        </TabsList>

        {/* Customers Tab */}
        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Customer List</CardTitle>
                  <CardDescription>All registered customers</CardDescription>
                </div>
                <Button>Add Customer</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex gap-2">
                  <Search className="absolute mt-2 ml-2 text-muted-foreground" size={20} />
                  <Input
                    placeholder="Search customers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2">Name</th>
                      <th className="text-left py-2 px-2">Email</th>
                      <th className="text-left py-2 px-2">Status</th>
                      <th className="text-left py-2 px-2">Orders</th>
                      <th className="text-left py-2 px-2">Joined</th>
                      <th className="text-left py-2 px-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((customer) => (
                      <tr key={customer.id} className="border-b hover:bg-muted/50">
                        <td className="py-2 px-2 font-semibold">{customer.name}</td>
                        <td className="py-2 px-2">{customer.email}</td>
                        <td className="py-2 px-2">
                          <Badge className={getStatusColor(customer.status)}>{customer.status}</Badge>
                        </td>
                        <td className="py-2 px-2">{customer.orders}</td>
                        <td className="py-2 px-2">{customer.joined}</td>
                        <td className="py-2 px-2">
                          <Button variant="ghost" size="sm">
                            <MoreVertical size={16} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Workers Tab */}
        <TabsContent value="workers" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Worker List</CardTitle>
                  <CardDescription>All registered workers</CardDescription>
                </div>
                <Button>Add Worker</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex gap-2">
                  <Search className="absolute mt-2 ml-2 text-muted-foreground" size={20} />
                  <Input
                    placeholder="Search workers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2">Name</th>
                      <th className="text-left py-2 px-2">Email</th>
                      <th className="text-left py-2 px-2">Status</th>
                      <th className="text-left py-2 px-2">Tasks</th>
                      <th className="text-left py-2 px-2">Rating</th>
                      <th className="text-left py-2 px-2">Joined</th>
                      <th className="text-left py-2 px-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workers.map((worker) => (
                      <tr key={worker.id} className="border-b hover:bg-muted/50">
                        <td className="py-2 px-2 font-semibold">{worker.name}</td>
                        <td className="py-2 px-2">{worker.email}</td>
                        <td className="py-2 px-2">
                          <Badge className={getStatusColor(worker.status)}>{worker.status}</Badge>
                        </td>
                        <td className="py-2 px-2">{worker.tasks}</td>
                        <td className="py-2 px-2">
                          <div className="flex items-center gap-1">
                            <span>{worker.rating}</span>
                            <span className="text-yellow-500">★</span>
                          </div>
                        </td>
                        <td className="py-2 px-2">{worker.joined}</td>
                        <td className="py-2 px-2">
                          <Button variant="ghost" size="sm">
                            <MoreVertical size={16} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
