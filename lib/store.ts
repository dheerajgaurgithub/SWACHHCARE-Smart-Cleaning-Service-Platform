import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import bookingReducer from "./slices/bookingSlice"
import workerReducer from "./slices/workerSlice"
import paymentReducer from "./slices/paymentSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    bookings: bookingReducer,
    workers: workerReducer,
    payments: paymentReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
