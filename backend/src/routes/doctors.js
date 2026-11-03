const express = require("express");
const {
  getDoctors,
  getDoctorById,
  getDoctorSlots,
  updateProfile,
  updateAvailability,
  getMe,
} = require("../controllers/doctorController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/roleGuard");

const router = express.Router();

router.get("/", getDoctors);
router.get("/:id", getDoctorById);
router.get("/:id/slots", getDoctorSlots);

router.use(protect);
router.get("/auth/me", authorize("doctor"), getMe);
router.put("/profile", authorize("doctor"), updateProfile);
router.put("/availability", authorize("doctor"), updateAvailability);

module.exports = router;
