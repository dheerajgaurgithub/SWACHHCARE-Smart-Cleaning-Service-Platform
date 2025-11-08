"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    platformName: "SWACHHCARE",
    commissionRate: "15",
    minWorkerRating: "3.5",
    maintenanceMode: false,
    bookingNotifications: true,
    workerApprovalRequired: true,
  })

  const handleChange = (field: string, value: string | boolean) => {
    setSettings({ ...settings, [field]: value })
  }

  const handleSave = () => {
    console.log("[v0] Settings saved:", settings)
    alert("Settings updated successfully!")
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Admin Settings</h1>
        <p className="text-muted-foreground">Configure platform-wide settings</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="business">Business Rules</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Information</CardTitle>
              <CardDescription>Basic platform details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Platform Name</label>
                <Input value={settings.platformName} onChange={(e) => handleChange("platformName", e.target.value)} />
              </div>

              <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium">Maintenance Mode</p>
                  <p className="text-sm text-muted-foreground">Disable platform access for users</p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(val) => handleChange("maintenanceMode", val)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Rules */}
        <TabsContent value="business" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Business Configuration</CardTitle>
              <CardDescription>Platform business rules and policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Commission Rate (%)</label>
                <Input
                  type="number"
                  value={settings.commissionRate}
                  onChange={(e) => handleChange("commissionRate", e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">Platform commission on each booking</p>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Minimum Worker Rating</label>
                <Input
                  type="number"
                  step="0.1"
                  value={settings.minWorkerRating}
                  onChange={(e) => handleChange("minWorkerRating", e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">Minimum rating required to stay active</p>
              </div>

              <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium">Worker Approval Required</p>
                  <p className="text-sm text-muted-foreground">Manually approve new worker registrations</p>
                </div>
                <Switch
                  checked={settings.workerApprovalRequired}
                  onCheckedChange={(val) => handleChange("workerApprovalRequired", val)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Control system notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium">Booking Notifications</p>
                  <p className="text-sm text-muted-foreground">Send alerts for new bookings</p>
                </div>
                <Switch
                  checked={settings.bookingNotifications}
                  onCheckedChange={(val) => handleChange("bookingNotifications", val)}
                />
              </div>

              <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium">System Alerts</p>
                  <p className="text-sm text-muted-foreground">Critical system notifications</p>
                </div>
                <Switch defaultChecked onCheckedChange={() => {}} />
              </div>

              <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium">User Support Tickets</p>
                  <p className="text-sm text-muted-foreground">Notify on new support requests</p>
                </div>
                <Switch defaultChecked onCheckedChange={() => {}} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Button size="lg" onClick={handleSave}>
        Save All Settings
      </Button>
    </div>
  )
}
