"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Bell, Lock, Eye, Palette } from "lucide-react"
import { useTheme } from "@/lib/theme-provider"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: false,
    marketingEmails: true,
    orderUpdates: true,
    promotions: false,
  })

  const handleToggle = (key: string) => {
    setSettings({ ...settings, [key]: !settings[key] })
  }

  const handleSave = () => {
    console.log("[v0] Settings saved:", settings)
    alert("Settings updated successfully!")
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-4xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your preferences and account settings</p>
      </div>

      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette size={20} />
            Theme & Appearance
          </CardTitle>
          <CardDescription>Choose your preferred theme</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setTheme("light")}
              className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center justify-center gap-2 ${
                theme === "light" ? "border-primary bg-primary/10" : "border-muted hover:border-primary"
              }`}
            >
              <div className="w-8 h-8 bg-white rounded border-2 border-gray-300"></div>
              <span className="text-sm font-medium">Light</span>
            </button>

            <button
              onClick={() => setTheme("dark")}
              className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center justify-center gap-2 ${
                theme === "dark" ? "border-primary bg-primary/10" : "border-muted hover:border-primary"
              }`}
            >
              <div className="w-8 h-8 bg-gray-900 rounded border-2 border-gray-700"></div>
              <span className="text-sm font-medium">Dark</span>
            </button>

            <button
              onClick={() => setTheme("system")}
              className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center justify-center gap-2 ${
                theme === "system" ? "border-primary bg-primary/10" : "border-muted hover:border-primary"
              }`}
            >
              <div className="w-8 h-8 rounded border-2 border-gray-400 flex items-center justify-center text-xs font-bold">
                OS
              </div>
              <span className="text-sm font-medium">System</span>
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            {theme === "system" && "Using your system preference"}
            {theme === "light" && "Light mode for better daytime viewing"}
            {theme === "dark" && "Dark mode for reduced eye strain"}
          </p>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell size={20} />
            Notifications
          </CardTitle>
          <CardDescription>Choose how you want to receive updates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: "emailNotifications", label: "Email Notifications", desc: "Receive updates via email" },
            { key: "smsNotifications", label: "SMS Notifications", desc: "Get alerts on your phone" },
            { key: "pushNotifications", label: "Push Notifications", desc: "Receive app notifications" },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div>
                <p className="font-medium">{item.label}</p>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
              <Switch
                checked={settings[item.key as keyof typeof settings] as boolean}
                onCheckedChange={() => handleToggle(item.key)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye size={20} />
            Preferences
          </CardTitle>
          <CardDescription>Customize your experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: "orderUpdates", label: "Order Updates", desc: "Notifications about your bookings" },
            { key: "promotions", label: "Promotions & Offers", desc: "Special deals and discounts" },
            { key: "marketingEmails", label: "Marketing Emails", desc: "News and company updates" },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div>
                <p className="font-medium">{item.label}</p>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
              <Switch
                checked={settings[item.key as keyof typeof settings] as boolean}
                onCheckedChange={() => handleToggle(item.key)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock size={20} />
            Security
          </CardTitle>
          <CardDescription>Manage your account security</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start bg-transparent">
            Change Password
          </Button>
          <Button variant="outline" className="w-full justify-start bg-transparent">
            Two-Factor Authentication
          </Button>
          <Button variant="destructive" className="w-full justify-start">
            Delete Account
          </Button>
        </CardContent>
      </Card>

      <Button size="lg" className="w-full md:w-auto" onClick={handleSave}>
        Save Settings
      </Button>
    </div>
  )
}
