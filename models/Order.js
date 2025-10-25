const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    address: { type: String, required: true },
    cylinderType: {
      type: String,
      enum: ["6kg", "13kg", "50kg"],
      required: true,
    },
    priority: { type: String, enum: ["Normal", "High"], default: "Normal" },
    status: {
      type: String,
      enum: ["Pending", "Assigned", "In Transit", "Delivered"],
      default: "Pending",
    },
    assignedDriver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
