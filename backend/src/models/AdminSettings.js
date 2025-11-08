const mongoose = require("mongoose")

const adminSettingsSchema = new mongoose.Schema(
  {
    platformCommission: { type: Number, default: 20 }, // percentage
    platformCommissionType: { type: String, enum: ["percentage", "fixed"], default: "percentage" },

    // Offers & Discounts
    offers: [
      {
        code: String,
        discount: Number,
        discountType: { type: String, enum: ["percentage", "fixed"] },
        maxUses: Number,
        usedCount: { type: Number, default: 0 },
        validFrom: Date,
        validTo: Date,
        isActive: Boolean,
      },
    ],

    // Theme & Branding
    theme: {
      primaryColor: { type: String, default: "#10b981" },
      secondaryColor: { type: String, default: "#1e3a8a" },
      darkMode: { type: Boolean, default: false },
    },

    // Platform Settings
    minimumBookingAmount: { type: Number, default: 100 },
    maximumBookingAmount: { type: Number, default: 50000 },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

module.exports = mongoose.model("AdminSettings", adminSettingsSchema)
