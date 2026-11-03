const { check } = require("express-validator");

exports.createPrescriptionValidator = [
  check("patientId", "Patient ID is required").not().isEmpty(),
  check("appointmentId", "Appointment ID is required").not().isEmpty(),
  check("diagnosis", "Diagnosis is required").not().isEmpty(),
  check("medicines", "Medicines array is required").isArray({ min: 1 }),
];
