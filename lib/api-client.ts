// Client-side API helper functions

export const apiClient = {
  async register(data: { name: string; email: string; password: string; role: string }) {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return response.json()
  },

  async login(email: string, password: string) {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    return response.json()
  },

  async getBookings(userId: string) {
    const response = await fetch(`/api/bookings?userId=${userId}`)
    return response.json()
  },

  async createBooking(data: any) {
    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return response.json()
  },

  async getTasks(workerId: string, status?: string) {
    const query = new URLSearchParams()
    query.append("workerId", workerId)
    if (status) query.append("status", status)
    const response = await fetch(`/api/tasks?${query}`)
    return response.json()
  },

  async updateTask(taskId: string, updates: any) {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })
    return response.json()
  },

  async getWorkers(service?: string, minRating?: number) {
    const query = new URLSearchParams()
    if (service) query.append("service", service)
    if (minRating) query.append("minRating", minRating.toString())
    const response = await fetch(`/api/workers?${query}`)
    return response.json()
  },

  async getAnalytics(period = "month") {
    const response = await fetch(`/api/analytics?period=${period}`)
    return response.json()
  },

  async processPayment(data: { bookingId: string; amount: number; method: string }) {
    const response = await fetch("/api/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return response.json()
  },
}
