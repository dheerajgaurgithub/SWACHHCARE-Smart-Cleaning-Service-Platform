"use client"

import type React from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/store"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, LogOut, Home, BarChart3, Users, Briefcase, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import Card from "@/components/ui/card"
import CardHeader from "@/components/ui/card-header"
import CardTitle from "@/components/ui/card-title"
import CardDescription from "@/components/ui/card-description"
import CardContent from "@/components/ui/card-content"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const pathname = usePathname()
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)

  if (user?.role !== "admin") {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle className="text-destructive">Access Denied</CardTitle>
              <CardDescription>You don't have permission to access admin panel</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </>
    )
  }

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: Home },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/workers", label: "Hire Workers", icon: Briefcase },
    { href: "/admin/services", label: "Packages", icon: Briefcase },
    { href: "/admin/assignments", label: "Assignments", icon: Settings },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ]

  const isActive = (path: string) => pathname === path

  return (
    <>
      <Navbar />
      <div className="flex h-[calc(100vh-64px)]">
        {/* Desktop Sidebar */}
        <div
          className={`hidden md:flex flex-col bg-sidebar border-r border-sidebar-border w-64 transition-all duration-300 ${
            !sidebarOpen ? "-ml-64" : ""
          }`}
        >
          <div className="flex-1 overflow-y-auto p-6 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive(item.href)
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent"
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                </Link>
              )
            })}
          </div>

          <div className="border-t border-sidebar-border p-6">
            <Button variant="outline" className="w-full flex items-center gap-2 bg-transparent" asChild>
              <Link href="/auth/login">
                <LogOut size={18} />
                Logout
              </Link>
            </Button>
          </div>
        </div>

        {/* Mobile Sidebar Toggle */}
        <div className="md:hidden fixed bottom-6 right-6 z-40">
          <Button
            size="lg"
            className="rounded-full w-14 h-14 flex items-center justify-center"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-30 bg-background/80 backdrop-blur-sm">
            <div className="bg-sidebar w-64 h-full shadow-lg flex flex-col">
              <div className="flex-1 overflow-y-auto p-6 space-y-2 pt-16">
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}>
                      <div
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          isActive(item.href)
                            ? "bg-sidebar-primary text-sidebar-primary-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent"
                        }`}
                      >
                        <Icon size={20} />
                        <span className="font-medium">{item.label}</span>
                      </div>
                    </Link>
                  )
                })}
              </div>
              <div className="border-t border-sidebar-border p-6">
                <Button variant="outline" className="w-full flex items-center gap-2 bg-transparent" asChild>
                  <Link href="/auth/login">
                    <LogOut size={18} />
                    Logout
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <main className="p-4 md:p-8">{children}</main>
        </div>
      </div>
    </>
  )
}
