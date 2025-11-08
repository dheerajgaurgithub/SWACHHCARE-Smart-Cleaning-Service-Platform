import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"

interface Payment {
  id: string
  bookingId: string
  amount: number
  method: "card" | "upi" | "wallet"
  status: "pending" | "completed" | "failed"
  razorpayOrderId?: string
  createdAt: string
}

interface PaymentState {
  payments: Payment[]
  currentPayment: Payment | null
  loading: boolean
  error: string | null
}

const initialState: PaymentState = {
  payments: [],
  currentPayment: null,
  loading: false,
  error: null,
}

export const initiatePayment = createAsyncThunk(
  "payments/initiate",
  async (paymentData: { bookingId: string; amount: number; method: string }) => {
    const response = await fetch("/api/payments/initiate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(paymentData),
    })
    return response.json()
  },
)

export const verifyPayment = createAsyncThunk(
  "payments/verify",
  async (paymentData: { razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string }) => {
    const response = await fetch("/api/payments/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(paymentData),
    })
    return response.json()
  },
)

const paymentSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {
    setCurrentPayment: (state, action: PayloadAction<Payment | null>) => {
      state.currentPayment = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initiatePayment.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(initiatePayment.fulfilled, (state, action) => {
        state.loading = false
        state.currentPayment = action.payload.payment
      })
      .addCase(initiatePayment.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Payment initiation failed"
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.currentPayment = action.payload.payment
        state.payments.push(action.payload.payment)
      })
  },
})

export const { setCurrentPayment } = paymentSlice.actions
export default paymentSlice.reducer
