import { apiClient } from "@/lib/api-client"

export const adminAPI = {
  getDashboardStats: () => apiClient.get("/admin/dashboard/stats"),

  getWorkers: (filters?: any) => apiClient.get(`/admin/workers?${new URLSearchParams(filters)}`),

  getCustomers: (filters?: any) => apiClient.get(`/admin/customers?${new URLSearchParams(filters)}`),

  getTransactions: (filters?: any) => apiClient.get(`/admin/transactions?${new URLSearchParams(filters)}`),

  approveWorker: (workerId: string) => apiClient.post(`/admin/workers/${workerId}/approve`, {}),

  rejectWorker: (workerId: string, reason: string) => apiClient.post(`/admin/workers/${workerId}/reject`, { reason }),

  blockWorker: (workerId: string) => apiClient.post(`/admin/workers/${workerId}/block`, {}),

  blockCustomer: (customerId: string) => apiClient.post(`/admin/customers/${customerId}/block`, {}),

  getSettings: () => apiClient.get("/admin/settings"),

  updateSettings: (settings: any) => apiClient.put("/admin/settings", settings),

  getContactMessages: () => apiClient.get("/admin/contact-messages"),

  replyToMessage: (messageId: string, reply: string) =>
    apiClient.post(`/admin/contact-messages/${messageId}/reply`, { reply }),

  getReports: (type?: string) => apiClient.get(`/admin/reports?type=${type || "all"}`),

  generateReport: (type: string, dateRange: any) => apiClient.post("/admin/reports/generate", { type, dateRange }),
}
