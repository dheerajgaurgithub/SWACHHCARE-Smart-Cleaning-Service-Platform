import { apiClient } from "@/lib/api-client"

export const authAPI = {
  register: (data: {
    name: string
    email: string
    password: string
    role: "customer" | "worker"
    phone: string
  }) => apiClient.post("/auth/register", data, false),

  login: (email: string, password: string) => apiClient.post("/auth/login", { email, password }, false),

  logout: () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  },

  verifyOTP: (email: string, otp: string) => apiClient.post("/auth/verify-otp", { email, otp }, false),

  sendOTP: (email: string) => apiClient.post("/auth/send-otp", { email }, false),

  forgotPassword: (email: string) => apiClient.post("/auth/forgot-password", { email }, false),

  resetPassword: (token: string, password: string) =>
    apiClient.post("/auth/reset-password", { token, password }, false),

  getCurrentUser: () => apiClient.get("/auth/me"),

  refreshToken: () => apiClient.post("/auth/refresh-token", {}),
}
