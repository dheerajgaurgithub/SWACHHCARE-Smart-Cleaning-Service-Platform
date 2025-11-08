import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"

interface Task {
  id: string
  bookingId: string
  workerId: string
  service: string
  status: "Assigned" | "Confirmed" | "In Progress" | "Completed"
  estimatedTime: number
  amount: number
  createdAt: string
}

interface Worker {
  id: string
  name: string
  phone: string
  rating: number
  totalEarnings: number
  completedTasks: number
}

interface WorkerState {
  tasks: Task[]
  workers: Worker[]
  currentWorker: Worker | null
  loading: boolean
  error: string | null
}

const initialState: WorkerState = {
  tasks: [],
  workers: [],
  currentWorker: null,
  loading: false,
  error: null,
}

export const fetchWorkerTasks = createAsyncThunk("workers/fetchTasks", async (workerId: string) => {
  const response = await fetch(`/api/tasks?workerId=${workerId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  })
  return response.json()
})

export const updateTaskStatus = createAsyncThunk(
  "workers/updateTaskStatus",
  async ({ taskId, status }: { taskId: string; status: string }) => {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ status }),
    })
    return response.json()
  },
)

export const fetchAvailableWorkers = createAsyncThunk("workers/fetchAvailable", async () => {
  const response = await fetch("/api/workers", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  })
  return response.json()
})

const workerSlice = createSlice({
  name: "workers",
  initialState,
  reducers: {
    setCurrentWorker: (state, action: PayloadAction<Worker | null>) => {
      state.currentWorker = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkerTasks.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchWorkerTasks.fulfilled, (state, action) => {
        state.loading = false
        state.tasks = action.payload.tasks
      })
      .addCase(fetchWorkerTasks.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch tasks"
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const taskIndex = state.tasks.findIndex((t) => t.id === action.payload.task.id)
        if (taskIndex > -1) {
          state.tasks[taskIndex] = action.payload.task
        }
      })
      .addCase(fetchAvailableWorkers.fulfilled, (state, action) => {
        state.workers = action.payload.workers
      })
  },
})

export const { setCurrentWorker } = workerSlice.actions
export default workerSlice.reducer
