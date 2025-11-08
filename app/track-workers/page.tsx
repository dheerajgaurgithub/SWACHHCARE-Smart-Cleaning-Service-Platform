"use client"

import { useState } from "react"
import { MapPinIcon, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

// Mock worker data with coordinates
const mockWorkers = [
  {
    id: 1,
    name: "Raj Kumar",
    rating: 4.8,
    reviews: 342,
    services: "Cleaning, Dusting, Mopping",
    lat: 28.6139,
    lng: 77.209,
    availability: "Available Now",
    distance: "0.5 km",
    image: "/hardworking-construction-worker.png",
    specialization: "Home Cleaning Expert",
    hourlyRate: "₹200/hour",
  },
  {
    id: 2,
    name: "Priya Singh",
    rating: 4.9,
    reviews: 512,
    services: "Laundry, Ironing, Dry Cleaning",
    lat: 28.6155,
    lng: 77.2117,
    availability: "Available in 15 min",
    distance: "1.2 km",
    image: "/hardworking-construction-worker.png",
    specialization: "Laundry Specialist",
    hourlyRate: "₹150/hour",
  },
  {
    id: 3,
    name: "Anil Patel",
    rating: 4.7,
    reviews: 289,
    services: "Car Washing, Detailing",
    lat: 28.6125,
    lng: 77.2085,
    availability: "Available Now",
    distance: "0.8 km",
    image: "/hardworking-construction-worker.png",
    specialization: "Car Care Expert",
    hourlyRate: "₹250/hour",
  },
  {
    id: 4,
    name: "Meera Verma",
    rating: 4.6,
    reviews: 198,
    services: "Kitchen Cleaning, Organization",
    lat: 28.6145,
    lng: 77.2095,
    availability: "Available Now",
    distance: "0.3 km",
    image: "/hardworking-construction-worker.png",
    specialization: "Kitchen Organization",
    hourlyRate: "₹180/hour",
  },
  {
    id: 5,
    name: "Vikram Singh",
    rating: 4.9,
    reviews: 401,
    services: "Deep Cleaning, Pest Control",
    lat: 28.6135,
    lng: 77.2105,
    availability: "Available in 30 min",
    distance: "1.1 km",
    image: "/hardworking-construction-worker.png",
    specialization: "Deep Cleaning Expert",
    hourlyRate: "₹220/hour",
  },
  {
    id: 6,
    name: "Sunita Sharma",
    rating: 4.8,
    reviews: 267,
    services: "Window Cleaning, Maintenance",
    lat: 28.6165,
    lng: 77.2075,
    availability: "Available Now",
    distance: "1.4 km",
    image: "/hardworking-construction-worker.png",
    specialization: "Window & Glass Expert",
    hourlyRate: "₹170/hour",
  },
]

export default function TrackWorkersPage() {
  const [selectedWorker, setSelectedWorker] = useState(mockWorkers[0])
  const [filters, setFilters] = useState("all")
  const [sortBy, setSortBy] = useState("distance")

  const sortedWorkers = [...mockWorkers].sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating
    if (sortBy === "distance") return Number.parseFloat(a.distance) - Number.parseFloat(b.distance)
    return 0
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-balance">Track & Hire Workers Near You</h1>
          <p className="text-muted-foreground">
            Real-time worker location tracking with verified ratings and instant booking
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <Card className="p-6 h-96 flex items-center justify-center bg-secondary relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />

              {/* Simplified Map Visualization */}
              <div className="relative w-full h-full">
                <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-px opacity-10">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className="border border-foreground" />
                  ))}
                </div>

                {/* Worker Markers */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-72 h-72">
                    {sortedWorkers.map((worker, idx) => {
                      const angle = (idx / sortedWorkers.length) * 360
                      const x = Math.cos((angle * Math.PI) / 180) * 120
                      const y = Math.sin((angle * Math.PI) / 180) * 120
                      return (
                        <button
                          key={worker.id}
                          onClick={() => setSelectedWorker(worker)}
                          className={`absolute w-10 h-10 rounded-full flex items-center justify-center transition transform hover:scale-110 ${
                            selectedWorker.id === worker.id
                              ? "bg-primary text-primary-foreground ring-4 ring-primary/30 scale-110"
                              : "bg-accent text-accent-foreground"
                          }`}
                          style={{
                            transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                          }}
                          title={worker.name}
                        >
                          <MapPinIcon className="w-5 h-5" />
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Center Marker */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-3 h-3 bg-foreground rounded-full ring-4 ring-foreground/20" />
                </div>

                {/* Map Attribution */}
                <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
                  Live Location View
                </div>
              </div>
            </Card>
          </div>

          {/* Selected Worker Details */}
          <div className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={selectedWorker.image || "/placeholder.svg"}
                  alt={selectedWorker.name}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h3 className="font-bold text-lg">{selectedWorker.name}</h3>
                  <p className="text-sm text-primary font-medium">{selectedWorker.specialization}</p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between pb-3 border-b">
                  <span className="text-sm text-muted-foreground">Rating</span>
                  <div className="flex items-center gap-1">
                    <span className="font-bold">{selectedWorker.rating}</span>
                    <span className="text-yellow-500">★</span>
                    <span className="text-xs text-muted-foreground">({selectedWorker.reviews})</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pb-3 border-b">
                  <span className="text-sm text-muted-foreground">Distance</span>
                  <span className="font-semibold">{selectedWorker.distance}</span>
                </div>

                <div className="flex items-center justify-between pb-3 border-b">
                  <span className="text-sm text-muted-foreground">Rate</span>
                  <span className="font-semibold">{selectedWorker.hourlyRate}</span>
                </div>

                <div className="flex items-center justify-between pb-3 border-b">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                    {selectedWorker.availability}
                  </span>
                </div>

                <div className="pt-2">
                  <p className="text-xs text-muted-foreground mb-1">Services</p>
                  <p className="text-sm font-medium">{selectedWorker.services}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button className="w-full bg-primary hover:bg-primary/90">Book Now</Button>
                <Button variant="outline" className="w-full bg-transparent">
                  Message
                </Button>
              </div>
            </Card>

            {/* Filters */}
            <Card className="p-4">
              <h4 className="font-bold mb-3 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Sort By
              </h4>
              <div className="space-y-2">
                <button
                  onClick={() => setSortBy("distance")}
                  className={`w-full p-2 rounded text-sm transition ${
                    sortBy === "distance" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  }`}
                >
                  Nearest First
                </button>
                <button
                  onClick={() => setSortBy("rating")}
                  className={`w-full p-2 rounded text-sm transition ${
                    sortBy === "rating" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  }`}
                >
                  Top Rated
                </button>
              </div>
            </Card>
          </div>
        </div>

        {/* Workers List */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Available Workers Nearby</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedWorkers.map((worker) => (
              <Card
                key={worker.id}
                className={`p-4 cursor-pointer transition hover:shadow-lg ${
                  selectedWorker.id === worker.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedWorker(worker)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={worker.image || "/placeholder.svg"}
                      alt={worker.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h3 className="font-bold text-sm">{worker.name}</h3>
                      <p className="text-xs text-muted-foreground">{worker.specialization}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-bold">{worker.rating}</span>
                    <span className="text-yellow-500 text-sm">★</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{worker.services}</p>
                <div className="flex justify-between items-center mb-3 text-xs">
                  <span className="text-muted-foreground">{worker.distance}</span>
                  <span className="font-semibold text-primary">{worker.hourlyRate}</span>
                </div>
                <Button size="sm" className="w-full text-xs">
                  Quick Book
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
