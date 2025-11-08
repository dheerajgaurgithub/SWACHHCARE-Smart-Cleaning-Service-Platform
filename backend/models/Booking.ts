import mongoose, { type Document, Schema } from "mongoose"

export interface IBooking extends Document {
  customerId: mongoose.Types.ObjectId
  workerId?: mongoose.Types.ObjectId
  service: string
  package: string
  date: Date
  time: string
  address: string
  totalAmount: number
  status: "Pending" | "Confirmed" | "In Progress" | "Completed" | "Cancelled"
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const BookingSchema = new Schema<IBooking>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    workerId: { type: Schema.Types.ObjectId, ref: "User" },
    service: { type: String, required: true },
    package: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    address: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "In Progress", "Completed", "Cancelled"],
      default: "Pending",
    },
    notes: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

export default mongoose.model<IBooking>("Booking", BookingSchema)
