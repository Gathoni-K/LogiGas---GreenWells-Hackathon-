const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    status: {
      type: String,
      enum: ["Available", "On Delivery", "Offline", "On Break"],
      default: "Available",
    },
    vehicle: { type: String }, // e.g., "Truck A - Capacity 50 Cylinders"
  },
  { timestamps: true }
);

module.exports = mongoose.model("Driver", driverSchema);
