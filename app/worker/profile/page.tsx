"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Mail, Phone, MapPin, Edit2, Star, Clock } from "lucide-react"

export default function WorkerProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: "Raj Kumar",
    email: "raj@example.com",
    phone: "+91-9876543210",
    address: "Mumbai, Maharashtra",
    bio: "Experienced cleaning professional with 5+ years in the industry",
    services: ["Home Cleaning", "Laundry", "Car Wash"],
    workingHours: {
      monday: { start: "09:00", end: "18:00", available: true },
      tuesday: { start: "09:00", end: "18:00", available: true },
      wednesday: { start: "09:00", end: "18:00", available: true },
      thursday: { start: "09:00", end: "18:00", available: true },
      friday: { start: "09:00", end: "18:00", available: true },
      saturday: { start: "10:00", end: "16:00", available: true },
      sunday: { start: "", end: "", available: false },
    },
  })

  const handleChange = (field: string, value: string) => {
    setProfile({ ...profile, [field]: value })
  }

  const handleSave = () => {
    setIsEditing(false)
    console.log("[v0] Worker profile saved:", profile)
    alert("Profile updated successfully!")
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold mb-2">Worker Profile</h1>
          <p className="text-muted-foreground">Manage your professional information</p>
        </div>
        <Button onClick={() => setIsEditing(!isEditing)} className="flex items-center gap-2">
          <Edit2 size={18} />
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </div>

      {/* Profile Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating</CardTitle>
            <Star className="text-yellow-600 w-4 h-4" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">4.8</div>
            <p className="text-xs text-muted-foreground mt-1">Based on 42 reviews</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
            <User className="text-blue-600 w-4 h-4" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">42</div>
            <p className="text-xs text-muted-foreground mt-1">Total assignments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Clock className="text-green-600 w-4 h-4" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12 min</div>
            <p className="text-xs text-muted-foreground mt-1">Average response time</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList>
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="hours">Working Hours</TabsTrigger>
        </TabsList>

        {/* Personal Information */}
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your basic profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <User size={16} />
                  Full Name
                </label>
                <Input
                  value={profile.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <Mail size={16} />
                  Email
                </label>
                <Input
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <Phone size={16} />
                  Phone
                </label>
                <Input
                  value={profile.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <MapPin size={16} />
                  Location
                </label>
                <Input
                  value={profile.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Bio</label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => handleChange("bio", e.target.value)}
                  disabled={!isEditing}
                  className="w-full p-3 rounded-lg border border-input disabled:bg-muted text-sm"
                  rows={3}
                />
              </div>

              {isEditing && (
                <Button size="lg" className="w-full" onClick={handleSave}>
                  Save Changes
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Services */}
        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle>Services You Offer</CardTitle>
              <CardDescription>Select which services you provide</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {["Home Cleaning", "Laundry", "Car Wash"].map((service) => (
                  <div key={service} className="flex items-center p-3 border rounded-lg">
                    <input
                      type="checkbox"
                      defaultChecked={profile.services.includes(service)}
                      disabled={!isEditing}
                      className="mr-3"
                    />
                    <label className="font-medium flex-1">{service}</label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Working Hours */}
        <TabsContent value="hours">
          <Card>
            <CardHeader>
              <CardTitle>Working Hours</CardTitle>
              <CardDescription>Set your availability for each day</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(profile.workingHours).map(([day, hours]) => (
                <div key={day} className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="w-24 font-medium capitalize">{day}</div>
                  {hours.available ? (
                    <>
                      <Input type="time" value={hours.start} disabled={!isEditing} className="w-24" />
                      <span>to</span>
                      <Input type="time" value={hours.end} disabled={!isEditing} className="w-24" />
                    </>
                  ) : (
                    <span className="text-muted-foreground">Not available</span>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
