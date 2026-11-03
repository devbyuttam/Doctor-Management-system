const { check } = require("express-validator");

exports.registerValidator = [
  check("name", "Name is required").not().isEmpty(),
  check("email", "Please include a valid email").isEmail(),
  check(
    "password",
    "Please enter a password with 6 or more characters",
  ).isLength({ min: 6 }),
  check("role", "Role is required").isIn(["patient", "doctor", "receptionist"]),
];

exports.loginValidator = [
  check("password", "Password is required").exists(),
  check().custom((value, { req }) => {
    const input = req.body.email || req.body.doctorId || req.body.identifier;
    if (!input || !input.trim()) {
      throw new Error("Please provide an email address or Doctor ID");
    }
    return true;
  }),
];
