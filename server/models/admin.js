import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "SwachhCare Admin",
  },
  email: {
    type: String,
    required: true,
    unique: true,
    default: "dheerajgaur.0fficial@gmail.com",
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "admin",
  },
  permissions: {
    canApproveWorkers: {
      type: Boolean,
      default: true,
    },
    canManageUsers: {
      type: Boolean,
      default: true,
    },
    canViewTransactions: {
      type: Boolean,
      default: true,
    },
    canEditPackages: {
      type: Boolean,
      default: true,
    },
  },
  totalIncome: {
    type: Number,
    default: 0,
  },
  transactions: [
    {
      type: {
        type: String, // "incoming" or "outgoing"
      },
      amount: Number,
      date: {
        type: Date,
        default: Date.now,
      },
      source: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Check if the model exists before compiling it
const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);

export default Admin;
