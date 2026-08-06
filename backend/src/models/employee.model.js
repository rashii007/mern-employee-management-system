const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId, // ✅ Changed to ObjectId
      ref: "Department", // ✅ Reference to Department model
      required: true,
    },
    position: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    salary: {
      type: Number,
      required: true,
      min: 0,
    },
    joiningDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["active", "onLeave", "on_leave", "inactive", "terminated"],
      default: "active",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Employee", employeeSchema);
