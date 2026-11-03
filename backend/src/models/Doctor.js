const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  doctorId: {
    type: String,
    uppercase: true,
    trim: true,
    sparse: true,
    unique: true,
  },
  medicalLicenseNumber: {
    type: String,
    trim: true,
  },
  specialization: { type: String, required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
  qualifications: [{ degree: String, institution: String, year: Number }],
  experience: { type: Number, default: 0 },
  consultationFee: { type: Number, required: true },
  about: { type: String },
  clinic: { name: String, address: String, city: String },
  location: { city: String, state: String, country: String },
  availability: [
    {
      day: {
        type: String,
        enum: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
      },
      startTime: String,
      endTime: String,
      slotDurationMinutes: { type: Number, default: 30 },
      isAvailable: { type: Boolean, default: true },
    },
  ],
  verificationStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  isAvailable: { type: Boolean, default: true },
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  gender: { type: String, enum: ["male", "female", "other"] },
  languages: [String],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Doctor", doctorSchema);
