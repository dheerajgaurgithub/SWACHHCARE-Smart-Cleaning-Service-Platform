import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"

interface User {
  id: string
  name: string
  email: string
  role: "customer" | "worker" | "admin"
  phone?: string
  avatar?: string
}

interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
}

const initialState: AuthState = {
  user: null,
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  loading: false,
  error: null,
  isAuthenticated: false,
}

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: { email: string; password: string; role?: string }) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    })
    const data = await response.json()
    if (data.token) {
      localStorage.setItem("token", data.token)
      localStorage.setItem("userRole", data.user.role)
    }
    return data
  },
)

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData: { name: string; email: string; password: string; role: string }) => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    })
    const data = await response.json()
    if (data.token) {
      localStorage.setItem("token", data.token)
    }
    return data
  },
)

export const googleSignIn = createAsyncThunk("auth/googleSignIn", async (idToken: string) => {
  const response = await fetch("/api/auth/google", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  })
  const data = await response.json()
  if (data.token) {
    localStorage.setItem("token", data.token)
  }
  return data
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem("token")
      localStorage.removeItem("userRole")
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthenticated = true
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Login failed"
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Registration failed"
      })
      .addCase(googleSignIn.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(googleSignIn.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
      })
      .addCase(googleSignIn.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Google sign-in failed"
      })
  },
})

export const { logout, setUser } = authSlice.actions
export default authSlice.reducer
