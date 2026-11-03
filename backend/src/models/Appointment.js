const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  tokenNumber: { type: Number },
  reason: { type: String },
  status: {
    type: String,
    enum: [
      "pending",
      "confirmed",
      "cancelled",
      "completed",
      "rejected",
      "no_show",
    ],
    default: "pending",
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "refunded", "failed"],
    default: "pending",
  },
  queueStatus: {
    type: String,
    enum: ["waiting", "in_consultation", "completed", "cancelled"],
    default: "waiting",
  },
  isWalkIn: { type: Boolean, default: false },
  cancelReason: { type: String },
  createdAt: { type: Date, default: Date.now },
});

appointmentSchema.index(
  { doctorId: 1, date: 1, startTime: 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $nin: ["cancelled", "rejected"] } },
  },
);

module.exports = mongoose.model("Appointment", appointmentSchema);
