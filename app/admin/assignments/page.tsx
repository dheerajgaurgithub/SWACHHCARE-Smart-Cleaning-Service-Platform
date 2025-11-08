"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2 } from "lucide-react"

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState([
    {
      id: 1,
      customerId: "CUST-001",
      customerName: "Rahul Sharma",
      workerId: "WORK-101",
      workerName: "Raj Kumar",
      service: "Home Cleaning",
      package: "Premium",
      status: "Active",
      assignedDate: "2024-12-10",
      rating: 4.8,
    },
    {
      id: 2,
      customerId: "CUST-002",
      customerName: "Priya Singh",
      workerId: "WORK-102",
      workerName: "Priya Worker",
      service: "Laundry",
      package: "Professional",
      status: "Active",
      assignedDate: "2024-12-08",
      rating: 4.6,
    },
    {
      id: 3,
      customerId: "CUST-003",
      customerName: "Amit Patel",
      workerId: "WORK-103",
      workerName: "Kavita Sharma",
      service: "Home Cleaning",
      package: "Premium",
      status: "Completed",
      assignedDate: "2024-12-05",
      rating: 4.9,
    },
  ])

  const customers = [
    { id: "CUST-001", name: "Rahul Sharma" },
    { id: "CUST-002", name: "Priya Singh" },
    { id: "CUST-003", name: "Amit Patel" },
    { id: "CUST-004", name: "Neha Gupta" },
  ]

  const workers = [
    { id: "WORK-101", name: "Raj Kumar" },
    { id: "WORK-102", name: "Priya Worker" },
    { id: "WORK-103", name: "Kavita Sharma" },
  ]

  const packages = ["Basic", "Professional", "Premium", "Elite"]
  const services = ["Home Cleaning", "Laundry", "Car Wash", "Organization"]

  const handleRemoveAssignment = (id: number) => {
    setAssignments(assignments.filter((a) => a.id !== id))
    alert("Assignment removed successfully")
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold mb-2">Worker Assignments</h1>
          <p className="text-muted-foreground">Assign workers to customers based on service packages</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus size={18} />
          Create Assignment
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Active Assignments</p>
              <p className="text-3xl font-bold text-green-600">
                {assignments.filter((a) => a.status === "Active").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Completed</p>
              <p className="text-3xl font-bold text-blue-600">
                {assignments.filter((a) => a.status === "Completed").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Total Assignments</p>
              <p className="text-3xl font-bold text-purple-600">{assignments.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Assignments</CardTitle>
          <CardDescription>All worker-customer assignments and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assignments.map((assignment) => (
              <Card key={assignment.id} className="border">
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Customer</p>
                        <p className="font-semibold">{assignment.customerName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Assigned Worker</p>
                        <p className="font-semibold">{assignment.workerName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Service</p>
                        <p className="font-semibold">{assignment.service}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Package</p>
                          <Badge className="bg-blue-100 text-blue-800">{assignment.package}</Badge>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Status</p>
                          <Badge
                            className={
                              assignment.status === "Active"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }
                          >
                            {assignment.status}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Rating</p>
                          <div className="flex items-center gap-1">
                            <span className="font-semibold">{assignment.rating}</span>
                            <span className="text-yellow-500">★</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Assigned</p>
                          <p className="text-sm">{assignment.assignedDate}</p>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full bg-transparent text-red-600 hover:text-red-700"
                        onClick={() => handleRemoveAssignment(assignment.id)}
                      >
                        <Trash2 size={14} className="mr-2" />
                        Remove Assignment
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
