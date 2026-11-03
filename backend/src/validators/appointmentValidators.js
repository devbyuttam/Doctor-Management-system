const { check } = require("express-validator");

exports.bookAppointmentValidator = [
  check("doctorId", "Doctor ID is required").not().isEmpty(),
  check("date", "Valid date is required").isISO8601(),
  check("startTime", "Start time is required").not().isEmpty(),
];
