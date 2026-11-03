const express = require("express");
const {
  register,
  login,
  logout,
  getMe,
  verifyDoctorId,
  getDoctorRegistry,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const { registerValidator, loginValidator } = require("../validators/authValidators");
const { validate } = require("../middleware/validate");

const router = express.Router();

router.post("/verify-doctor-id", verifyDoctorId);
router.get("/doctor-registry", getDoctorRegistry);
router.post("/register", registerValidator, validate, register);
router.post("/login", loginValidator, validate, login);
router.post("/logout", logout);
router.get("/me", protect, getMe);

module.exports = router;
