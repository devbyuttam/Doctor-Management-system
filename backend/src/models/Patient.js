const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ["male", "female", "other"] },
  bloodGroup: { type: String },
  address: { street: String, city: String, state: String, pincode: String },
  emergencyContact: { name: String, phone: String, relation: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Patient", patientSchema);
