"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar, Clock, MapPin } from "lucide-react"

export default function BookingsPage() {
  const [service, setService] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [address, setAddress] = useState("")
  const [package_, setPackage] = useState("")

  const services = [
    { id: "cleaning", name: "Home Cleaning", icon: "🧹" },
    { id: "laundry", name: "Laundry Service", icon: "👕" },
    { id: "carwash", name: "Car Wash", icon: "🚗" },
  ]

  const packages = [
    { value: "basic", label: "Basic - 2 hours (₹499)" },
    { value: "professional", label: "Professional - 4 hours (₹999)" },
    { value: "premium", label: "Premium - 8 hours (₹1,999)" },
  ]

  const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Booking submitted:", { service, date, time, address, package: package_ })
    alert("Booking confirmed! You'll receive a confirmation email shortly.")
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Book a Service</h1>
        <p className="text-muted-foreground">Select your service and preferred time slot</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Service Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Choose Service</CardTitle>
            <CardDescription>What service do you need?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {services.map((svc) => (
                <button
                  key={svc.id}
                  type="button"
                  onClick={() => setService(svc.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-center ${
                    service === svc.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="text-4xl mb-2">{svc.icon}</div>
                  <p className="font-semibold">{svc.name}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Date & Time Selection */}
        {service && (
          <Card>
            <CardHeader>
              <CardTitle>Choose Date & Time</CardTitle>
              <CardDescription>When would you like the service?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <Calendar size={16} />
                  Date
                </label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="max-w-xs"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-3">
                  <Clock size={16} />
                  Preferred Time
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTime(slot)}
                      className={`p-3 rounded-lg border-2 font-medium transition-all ${
                        time === slot
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Package Selection */}
        {service && (
          <Card>
            <CardHeader>
              <CardTitle>Select Package</CardTitle>
              <CardDescription>Choose the duration and price that fits your needs</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={package_} onValueChange={setPackage}>
                <div className="space-y-3">
                  {packages.map((pkg) => (
                    <div
                      key={pkg.value}
                      className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                    >
                      <RadioGroupItem value={pkg.value} id={pkg.value} />
                      <label htmlFor={pkg.value} className="flex-1 cursor-pointer font-medium">
                        {pkg.label}
                      </label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        )}

        {/* Address */}
        {service && (
          <Card>
            <CardHeader>
              <CardTitle>Service Location</CardTitle>
              <CardDescription>Where should we provide the service?</CardDescription>
            </CardHeader>
            <CardContent>
              <label className="flex items-start gap-2 text-sm font-medium mb-2">
                <MapPin size={16} className="mt-1" />
                Address
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your complete address"
                className="w-full p-3 rounded-lg border border-input"
                rows={3}
                required
              />
            </CardContent>
          </Card>
        )}

        {/* Submit */}
        {service && date && time && package_ && address && (
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Total Price</p>
                  <p className="text-3xl font-bold text-primary">
                    ₹{package_ === "basic" ? "499" : package_ === "professional" ? "999" : "1,999"}
                  </p>
                </div>
                <Button size="lg" className="px-8" type="submit">
                  Confirm Booking
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </form>
    </div>
  )
}
