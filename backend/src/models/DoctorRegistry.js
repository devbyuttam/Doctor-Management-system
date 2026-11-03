const mongoose = require("mongoose");

const doctorRegistrySchema = new mongoose.Schema({
  doctorId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  specialization: {
    type: String,
    required: true,
    trim: true,
  },
  department: {
    type: String,
    default: "General Medicine",
  },
  medicalLicenseNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  assignedEmail: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  contactPhone: {
    type: String,
    default: "+91-9800000000",
  },
  experience: {
    type: Number,
    default: 5,
  },
  consultationFee: {
    type: Number,
    default: 600,
  },
  hospitalBranch: {
    type: String,
    default: "Main Hospital - Central Wing",
  },
  isRegistered: {
    type: Boolean,
    default: false,
    index: true,
  },
  registeredAt: {
    type: Date,
  },
  registeredUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("DoctorRegistry", doctorRegistrySchema);
