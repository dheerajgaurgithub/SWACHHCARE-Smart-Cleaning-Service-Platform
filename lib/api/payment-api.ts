import { apiClient } from "@/lib/api-client"

export const paymentAPI = {
  createOrder: (amount: number, customerId: string) => apiClient.post("/payments/create-order", { amount, customerId }),

  verifyPayment: (orderId: string, paymentId: string, signature: string) =>
    apiClient.post("/payments/verify", { orderId, paymentId, signature }),

  getPaymentHistory: (limit?: number, offset?: number) =>
    apiClient.get(`/payments/history?limit=${limit || 10}&offset=${offset || 0}`),

  requestPayout: (amount: number, accountDetails: any) =>
    apiClient.post("/payments/payout", { amount, accountDetails }),

  getWorkerEarnings: () => apiClient.get("/payments/earnings"),

  getWorkerPayouts: () => apiClient.get("/payments/payouts"),

  getTransactionDetails: (transactionId: string) => apiClient.get(`/payments/transaction/${transactionId}`),
}
