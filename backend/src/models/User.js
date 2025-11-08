const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["customer", "worker", "admin"], default: "customer" },
    avatar: { type: String, default: null },

    // Customer specific
    addresses: [
      {
        label: String,
        street: String,
        city: String,
        state: String,
        zipCode: String,
        isDefault: Boolean,
      },
    ],
    savedPaymentMethods: [{ type: mongoose.Schema.Types.ObjectId, ref: "PaymentMethod" }],

    // Account & Status
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isBlocked: { type: Boolean, default: false },
    lastLogin: Date,

    // OTP & Reset
    otpCode: String,
    otpExpiry: Date,
    resetTokenExpiry: Date,

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Method to compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model("User", userSchema)
