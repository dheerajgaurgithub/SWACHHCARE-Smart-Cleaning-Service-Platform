import mongoose, { type Document, Schema } from "mongoose"

export interface ITask extends Document {
  bookingId: mongoose.Types.ObjectId
  workerId: mongoose.Types.ObjectId
  service: string
  status: "Assigned" | "Confirmed" | "In Progress" | "Completed"
  estimatedTime: number
  amount: number
  startTime?: Date
  endTime?: Date
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const TaskSchema = new Schema<ITask>(
  {
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
    workerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    service: { type: String, required: true },
    status: { type: String, enum: ["Assigned", "Confirmed", "In Progress", "Completed"], default: "Assigned" },
    estimatedTime: { type: Number, required: true },
    amount: { type: Number, required: true },
    startTime: { type: Date },
    endTime: { type: Date },
    notes: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

export default mongoose.model<ITask>("Task", TaskSchema)
