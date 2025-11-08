import { apiClient } from "@/lib/api-client"

export const bookingAPI = {
  getCustomerBookings: (filters?: any) => apiClient.get(`/bookings/customer?${new URLSearchParams(filters)}`),

  getWorkerBookings: (status?: string) => apiClient.get(`/bookings/worker?status=${status || "all"}`),

  getBookingDetails: (id: string) => apiClient.get(`/bookings/${id}`),

  createBooking: (data: any) => apiClient.post("/bookings", data),

  updateBookingStatus: (id: string, status: string) => apiClient.put(`/bookings/${id}`, { status }),

  assignWorker: (bookingId: string, workerId: string) => apiClient.post(`/bookings/${bookingId}/assign`, { workerId }),

  cancelBooking: (id: string, reason: string) => apiClient.post(`/bookings/${id}/cancel`, { reason }),

  addFeedback: (id: string, rating: number, comment: string) =>
    apiClient.post(`/bookings/${id}/feedback`, { rating, comment }),

  acceptBooking: (id: string) => apiClient.post(`/bookings/${id}/accept`, {}),

  rejectBooking: (id: string, reason: string) => apiClient.post(`/bookings/${id}/reject`, { reason }),

  completeBooking: (id: string) => apiClient.post(`/bookings/${id}/complete`, {}),

  startWork: (id: string) => apiClient.post(`/bookings/${id}/start`, {}),

  getAvailableWorkers: (serviceType: string, address: string) =>
    apiClient.get(`/bookings/workers/available?serviceType=${serviceType}&address=${address}`),
}
