import mongoose, { type Document, Schema } from "mongoose"
import bcrypt from "bcryptjs"

export interface IUser extends Document {
  name: string
  email: string
  password?: string
  role: "customer" | "worker" | "admin"
  phone?: string
  avatar?: string
  address?: string
  city?: string
  rating?: number
  totalEarnings?: number
  completedTasks?: number
  googleId?: string
  createdAt: Date
  updatedAt: Date
  comparePassword(password: string): Promise<boolean>
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, enum: ["customer", "worker", "admin"], default: "customer" },
    phone: { type: String },
    avatar: { type: String },
    address: { type: String },
    city: { type: String },
    rating: { type: Number, default: 5 },
    totalEarnings: { type: Number, default: 0 },
    completedTasks: { type: Number, default: 0 },
    googleId: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password || "", salt)
    next()
  } catch (error: any) {
    next(error)
  }
})

UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password || "")
}

export default mongoose.model<IUser>("User", UserSchema)
