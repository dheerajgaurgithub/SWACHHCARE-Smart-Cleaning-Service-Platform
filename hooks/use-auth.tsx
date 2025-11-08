"use client"

import { useState, useContext, createContext, useEffect, type ReactNode } from "react"
import { authAPI } from "@/lib/api/auth-api"

export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "worker" | "customer"
  phone?: string
  avatar?: string
  isVerified?: boolean
}

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  signup: (data: any) => Promise<void>
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token")
      if (token) {
        const userData = await authAPI.getCurrentUser()
        setUser(userData.user || userData)
      }
    } catch (err) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await authAPI.login(email, password)
      setUser(data.user)
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
    } catch (err: any) {
      const errorMessage = err.message || "Login failed"
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    authAPI.logout()
    setUser(null)
    setError(null)
  }

  const signup = async (data: any) => {
    setLoading(true)
    setError(null)
    try {
      const result = await authAPI.register(data)
      setUser(result.user)
      localStorage.setItem("token", result.token)
      localStorage.setItem("user", JSON.stringify(result.user))
    } catch (err: any) {
      const errorMessage = err.message || "Signup failed"
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    logout,
    signup,
    checkAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
