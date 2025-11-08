import mongoose, { type Document, Schema } from "mongoose"

export interface IPayment extends Document {
  bookingId: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  amount: number
  method: "card" | "upi" | "wallet"
  status: "pending" | "completed" | "failed" | "refunded"
  razorpayOrderId?: string
  razorpayPaymentId?: string
  razorpaySignature?: string
  transactionId?: string
  createdAt: Date
  updatedAt: Date
}

const PaymentSchema = new Schema<IPayment>(
  {
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    method: { type: String, enum: ["card", "upi", "wallet"], required: true },
    status: { type: String, enum: ["pending", "completed", "failed", "refunded"], default: "pending" },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    transactionId: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

export default mongoose.model<IPayment>("Payment", PaymentSchema)
