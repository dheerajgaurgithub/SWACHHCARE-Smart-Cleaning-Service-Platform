import mongoose, { type Document, Schema } from "mongoose"

export interface IPackage extends Document {
  name: string
  description: string
  price: number
  duration: number
  services: string[]
  features: string[]
  discount?: number
  isCombo?: boolean
  type: "basic" | "professional" | "premium" | "combo"
  createdAt: Date
  updatedAt: Date
}

const PackageSchema = new Schema<IPackage>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: Number, required: true },
    services: [{ type: String }],
    features: [{ type: String }],
    discount: { type: Number, default: 0 },
    isCombo: { type: Boolean, default: false },
    type: { type: String, enum: ["basic", "professional", "premium", "combo"], required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

export default mongoose.model<IPackage>("Package", PackageSchema)
