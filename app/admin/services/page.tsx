"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2 } from "lucide-react"
import { useState } from "react"

export default function ServicesPage() {
  const [services, setServices] = useState([
    {
      id: 1,
      name: "Home Cleaning",
      description: "Professional deep cleaning of homes",
      price: "₹499",
      originalPrice: "₹699",
      frequency: "One-time",
      duration: "3-4 hours",
      workers: 45,
      bookings: 234,
      status: "Active",
    },
    {
      id: 2,
      name: "Laundry Service",
      description: "Professional laundry and ironing",
      price: "₹399",
      originalPrice: "₹599",
      frequency: "Weekly",
      duration: "2 hours",
      workers: 32,
      bookings: 156,
      status: "Active",
    },
    {
      id: 3,
      name: "Car Wash",
      description: "Exterior and interior car cleaning",
      price: "₹399",
      originalPrice: "₹599",
      frequency: "Monthly",
      duration: "1 hour",
      workers: 28,
      bookings: 189,
      status: "Active",
    },
    {
      id: 4,
      name: "Premium Cleaning Combo",
      description: "Home cleaning + Laundry service combo",
      price: "₹799",
      originalPrice: "₹1,200",
      frequency: "Bi-weekly",
      duration: "4-5 hours",
      workers: 50,
      bookings: 98,
      status: "Active",
    },
  ])

  const getDemandColor = (status: string) => {
    return status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
  }

  const handleDelete = (id: number) => {
    setServices(services.filter((s) => s.id !== id))
    alert("Service deleted successfully")
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold mb-2">Manage Services</h1>
          <p className="text-muted-foreground">Create and manage service packages</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus size={18} />
          Create Service
        </Button>
      </div>

      <div className="space-y-4">
        {services.map((service) => (
          <Card key={service.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold">{service.name}</h3>
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                    </div>
                    <Badge className={getDemandColor(service.status)}>{service.status}</Badge>
                  </div>
                  <div className="mt-3 space-y-1">
                    <p className="text-sm">
                      <span className="text-muted-foreground">Duration:</span> {service.duration}
                    </p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">Frequency:</span> {service.frequency}
                    </p>
                  </div>
                  <p className="text-lg font-semibold text-primary mt-3">
                    {service.price}
                    <span className="text-sm text-muted-foreground line-through ml-2">{service.originalPrice}</span>
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Workers</p>
                      <p className="text-2xl font-bold">{service.workers}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Bookings</p>
                      <p className="text-2xl font-bold">{service.bookings}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" className="flex-1 bg-transparent" size="sm">
                      <Edit size={14} className="mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 bg-transparent text-red-600"
                      size="sm"
                      onClick={() => handleDelete(service.id)}
                    >
                      <Trash2 size={14} className="mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
