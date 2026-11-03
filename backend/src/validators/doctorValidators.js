const { check } = require("express-validator");

exports.updateDoctorValidator = [
  check("specialization", "Specialization is required")
    .optional()
    .not()
    .isEmpty(),
  check("consultationFee", "Consultation fee must be a number")
    .optional()
    .isNumeric(),
];
