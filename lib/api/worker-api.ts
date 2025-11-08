import { apiClient } from "@/lib/api-client"

export const workerAPI = {
  getProfile: () => apiClient.get("/workers/profile"),

  updateProfile: (data: any) => apiClient.put("/workers/profile", data),

  updateAvailability: (availability: any) => apiClient.put("/workers/availability", { availability }),

  getAvailability: () => apiClient.get("/workers/availability"),

  checkIn: (location: { lat: number; lng: number }) => apiClient.post("/workers/attendance/check-in", { location }),

  checkOut: () => apiClient.post("/workers/attendance/check-out", {}),

  getAttendance: (dateRange?: any) => apiClient.get(`/workers/attendance?dateRange=${JSON.stringify(dateRange)}`),

  getEarnings: (period?: string) => apiClient.get(`/workers/earnings?period=${period || "month"}`),

  getPayouts: () => apiClient.get("/workers/payouts"),

  updateSkills: (skills: string[]) => apiClient.put("/workers/skills", { skills }),

  getRatings: () => apiClient.get("/workers/ratings"),

  requestPayout: (amount: number, bankDetails: any) =>
    apiClient.post("/workers/payout-request", {
      amount,
      bankDetails,
    }),

  uploadDocuments: (formData: FormData) => apiClient.post("/workers/documents", formData),
}
