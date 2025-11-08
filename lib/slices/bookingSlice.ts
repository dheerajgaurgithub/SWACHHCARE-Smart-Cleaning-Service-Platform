import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"

interface Booking {
  id: string
  customerId: string
  service: string
  date: string
  time: string
  address: string
  package: string
  workerId?: string
  status: "Pending" | "Confirmed" | "In Progress" | "Completed" | "Cancelled"
  totalAmount: number
  createdAt: string
}

interface BookingState {
  bookings: Booking[]
  currentBooking: Booking | null
  loading: boolean
  error: string | null
}

const initialState: BookingState = {
  bookings: [],
  currentBooking: null,
  loading: false,
  error: null,
}

export const fetchBookings = createAsyncThunk("bookings/fetchBookings", async (userId: string) => {
  const response = await fetch(`/api/bookings?userId=${userId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  })
  return response.json()
})

export const createBooking = createAsyncThunk(
  "bookings/createBooking",
  async (bookingData: Omit<Booking, "id" | "createdAt" | "status">) => {
    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(bookingData),
    })
    return response.json()
  },
)

export const cancelBooking = createAsyncThunk("bookings/cancelBooking", async (bookingId: string) => {
  const response = await fetch(`/api/bookings/${bookingId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  })
  return response.json()
})

const bookingSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    setCurrentBooking: (state, action: PayloadAction<Booking | null>) => {
      state.currentBooking = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false
        state.bookings = action.payload.bookings
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch bookings"
      })
      .addCase(createBooking.pending, (state) => {
        state.loading = true
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false
        state.bookings.push(action.payload.booking)
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to create booking"
      })
  },
})

export const { setCurrentBooking } = bookingSlice.actions
export default bookingSlice.reducer
