"use client"

import type React from "react"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { loginUser } from "@/lib/slices/authSlice"
import type { AppDispatch, RootState } from "@/lib/store"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [userRole, setUserRole] = useState<"customer" | "worker" | "admin">("customer")
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth)
  const userRoleFromState = useSelector((state: RootState) => state.auth.user?.role)

  const demoCredentials = {
    admin: { email: "admin@swachhcare.com", password: "admin123" },
    worker: { email: "worker@swachhcare.com", password: "worker123" },
    customer: { email: "customer@swachhcare.com", password: "customer123" },
  }

  const handleDemoLogin = (role: "customer" | "worker" | "admin") => {
    setEmail(demoCredentials[role].email)
    setPassword(demoCredentials[role].password)
    setUserRole(role)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await dispatch(loginUser({ email, password, role: userRole }))
    if (result.payload?.success) {
      if (userRole === "admin") {
        router.push("/admin")
      } else if (userRole === "worker") {
        router.push("/worker")
      } else {
        router.push("/dashboard")
      }
    }
  }

  if (isAuthenticated) {
    router.push(userRoleFromState === "admin" ? "/admin" : userRoleFromState === "worker" ? "/worker" : "/dashboard")
  }

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-128px)] flex items-center justify-center bg-muted/30 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Sign in to your SWACHHCARE account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 space-y-2">
              <p className="text-sm font-medium">Demo Login:</p>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  variant={userRole === "admin" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleDemoLogin("admin")}
                  className="bg-transparent"
                >
                  Admin
                </Button>
                <Button
                  type="button"
                  variant={userRole === "worker" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleDemoLogin("worker")}
                  className="bg-transparent"
                >
                  Worker
                </Button>
                <Button
                  type="button"
                  variant={userRole === "customer" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleDemoLogin("customer")}
                  className="bg-transparent"
                >
                  Customer
                </Button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Password</label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
              {error && <div className="text-sm text-destructive">{error}</div>}
              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              <p className="text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/auth/register" className="text-primary hover:underline font-semibold">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </>
  )
}
