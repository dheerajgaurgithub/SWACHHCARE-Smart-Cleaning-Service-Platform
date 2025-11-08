"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Check, X } from "lucide-react"

export default function HireWorkersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedWorkers, setSelectedWorkers] = useState<number[]>([])

  const applications = [
    {
      id: 1,
      name: "Vikram Singh",
      email: "vikram@example.com",
      phone: "+91-9876543210",
      experience: "3 years",
      skills: ["Cleaning", "Laundry", "Organization"],
      rating: 4.7,
      status: "Pending",
      yearsExperience: 3,
    },
    {
      id: 2,
      name: "Sunita Devi",
      email: "sunita@example.com",
      phone: "+91-9876543211",
      experience: "5 years",
      skills: ["Cleaning", "Car Wash", "Maintenance"],
      rating: 4.9,
      status: "Pending",
      yearsExperience: 5,
    },
    {
      id: 3,
      name: "Mohan Kumar",
      email: "mohan@example.com",
      phone: "+91-9876543212",
      experience: "2 years",
      skills: ["Laundry", "Ironing"],
      rating: 4.5,
      status: "Pending",
      yearsExperience: 2,
    },
    {
      id: 4,
      name: "Geeta Sharma",
      email: "geeta@example.com",
      phone: "+91-9876543213",
      experience: "4 years",
      skills: ["Cleaning", "Cooking", "Childcare"],
      rating: 4.8,
      status: "Pending",
      yearsExperience: 4,
    },
  ]

  const approvedWorkers = [
    {
      id: 101,
      name: "Raj Kumar",
      email: "raj@example.com",
      phone: "+91-9876543200",
      skills: ["Cleaning", "Car Wash"],
      rating: 4.8,
      tasksCompleted: 42,
      hiredDate: "2024-09-01",
    },
    {
      id: 102,
      name: "Priya Worker",
      email: "priya.w@example.com",
      phone: "+91-9876543201",
      skills: ["Laundry", "Organization"],
      rating: 4.6,
      tasksCompleted: 38,
      hiredDate: "2024-09-10",
    },
    {
      id: 103,
      name: "Kavita Sharma",
      email: "kavita@example.com",
      phone: "+91-9876543202",
      skills: ["Cleaning", "Maintenance"],
      rating: 4.9,
      tasksCompleted: 52,
      hiredDate: "2024-08-01",
    },
  ]

  const handleApprove = (workerId: number) => {
    alert(`Worker ${workerId} has been approved and hired!`)
    setSelectedWorkers(selectedWorkers.filter((id) => id !== workerId))
  }

  const handleReject = (workerId: number) => {
    alert(`Worker ${workerId} application has been rejected`)
    setSelectedWorkers(selectedWorkers.filter((id) => id !== workerId))
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Hire Workers</h1>
        <p className="text-muted-foreground">Review applications and hire skilled workers for SWACHHCARE</p>
      </div>

      <Tabs defaultValue="applications" className="space-y-6">
        <TabsList>
          <TabsTrigger value="applications">Applications ({applications.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved Workers ({approvedWorkers.length})</TabsTrigger>
        </TabsList>

        {/* Applications Tab */}
        <TabsContent value="applications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Worker Applications</CardTitle>
              <CardDescription>Review and approve worker applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex gap-2">
                  <Search className="absolute mt-2 ml-2 text-muted-foreground" size={20} />
                  <Input
                    placeholder="Search applications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-4">
                {applications.map((app) => (
                  <Card key={app.id} className="border hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-lg font-bold">{app.name}</h3>
                              <p className="text-sm text-muted-foreground">{app.email}</p>
                              <p className="text-sm text-muted-foreground">{app.phone}</p>
                            </div>
                            <Badge className="bg-blue-100 text-blue-800">{app.status}</Badge>
                          </div>
                          <div className="mt-3">
                            <p className="text-sm font-semibold mb-1">Skills:</p>
                            <div className="flex flex-wrap gap-1">
                              {app.skills.map((skill) => (
                                <Badge key={skill} variant="outline" className="bg-green-50 text-green-700">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Experience</p>
                              <p className="text-xl font-bold">{app.yearsExperience} years</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Rating</p>
                              <div className="flex items-center gap-1">
                                <span className="text-xl font-bold">{app.rating}</span>
                                <span className="text-yellow-500">★</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2 pt-2">
                            <Button
                              className="flex-1 bg-green-600 hover:bg-green-700"
                              onClick={() => handleApprove(app.id)}
                            >
                              <Check size={16} className="mr-2" />
                              Approve & Hire
                            </Button>
                            <Button
                              variant="outline"
                              className="flex-1 bg-transparent"
                              onClick={() => handleReject(app.id)}
                            >
                              <X size={16} className="mr-2" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Approved Workers Tab */}
        <TabsContent value="approved" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Approved Workers</CardTitle>
              <CardDescription>Active workers on SWACHHCARE platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2">Name</th>
                      <th className="text-left py-2 px-2">Email</th>
                      <th className="text-left py-2 px-2">Skills</th>
                      <th className="text-left py-2 px-2">Rating</th>
                      <th className="text-left py-2 px-2">Tasks</th>
                      <th className="text-left py-2 px-2">Hired Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {approvedWorkers.map((worker) => (
                      <tr key={worker.id} className="border-b hover:bg-muted/50">
                        <td className="py-2 px-2 font-semibold">{worker.name}</td>
                        <td className="py-2 px-2">{worker.email}</td>
                        <td className="py-2 px-2">
                          <div className="flex gap-1">
                            {worker.skills.map((skill) => (
                              <Badge key={skill} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="py-2 px-2">
                          <div className="flex items-center gap-1">
                            <span>{worker.rating}</span>
                            <span className="text-yellow-500">★</span>
                          </div>
                        </td>
                        <td className="py-2 px-2">{worker.tasksCompleted}</td>
                        <td className="py-2 px-2">{worker.hiredDate}</td>
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
