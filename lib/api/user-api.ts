import { apiClient } from "@/lib/api-client"

export const userAPI = {
  getProfile: () => apiClient.get("/users/profile"),

  updateProfile: (data: any) => apiClient.put("/users/profile", data),

  getWallet: () => apiClient.get("/users/wallet"),

  addWalletBalance: (amount: number, paymentId: string) => apiClient.post("/users/wallet/add", { amount, paymentId }),

  getAddresses: () => apiClient.get("/users/addresses"),

  addAddress: (data: any) => apiClient.post("/users/addresses", data),

  updateAddress: (id: string, data: any) => apiClient.put(`/users/addresses/${id}`, data),

  deleteAddress: (id: string) => apiClient.delete(`/users/addresses/${id}`),

  updatePassword: (oldPassword: string, newPassword: string) =>
    apiClient.put("/users/password", { oldPassword, newPassword }),

  getNotifications: () => apiClient.get("/users/notifications"),

  markNotificationAsRead: (id: string) => apiClient.post(`/users/notifications/${id}/read`, {}),
}
