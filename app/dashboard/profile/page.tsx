"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User, Mail, Phone, MapPin, Edit2 } from "lucide-react"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: "Rahul Sharma",
    email: "rahul@example.com",
    phone: "+91-9876543210",
    address: "123 Green Street, Mumbai, 400001",
    city: "Mumbai",
    state: "Maharashtra",
    zipcode: "400001",
  })

  const handleChange = (field: string, value: string) => {
    setProfile({ ...profile, [field]: value })
  }

  const handleSave = () => {
    setIsEditing(false)
    console.log("[v0] Profile saved:", profile)
    alert("Profile updated successfully!")
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold mb-2">Profile</h1>
          <p className="text-muted-foreground">Manage your personal information</p>
        </div>
        <Button onClick={() => setIsEditing(!isEditing)} className="flex items-center gap-2">
          <Edit2 size={18} />
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Your basic profile details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
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
          </div>
        </CardContent>
      </Card>

      {/* Address Information */}
      <Card>
        <CardHeader>
          <CardTitle>Address</CardTitle>
          <CardDescription>Your service location</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <MapPin size={16} />
              Full Address
            </label>
            <textarea
              value={profile.address}
              onChange={(e) => handleChange("address", e.target.value)}
              disabled={!isEditing}
              className="w-full p-3 rounded-lg border border-input disabled:bg-muted"
              rows={3}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">City</label>
              <Input
                value={profile.city}
                onChange={(e) => handleChange("city", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">State</label>
              <Input
                value={profile.state}
                onChange={(e) => handleChange("state", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Zip Code</label>
              <Input
                value={profile.zipcode}
                onChange={(e) => handleChange("zipcode", e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {isEditing && (
        <Button size="lg" className="w-full md:w-auto" onClick={handleSave}>
          Save Changes
        </Button>
      )}
    </div>
  )
}
