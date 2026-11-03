const express = require("express");
const {
  getPatients,
  getPatientById,
  getMe,
  updateProfile,
} = require("../controllers/patientController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/roleGuard");

const router = express.Router();

router.use(protect);

router.get("/", authorize("admin", "receptionist"), getPatients);
router.get("/me", authorize("patient"), getMe);
router.put("/me", authorize("patient"), updateProfile);
router.get(
  "/:id",
  authorize("admin", "doctor", "receptionist"),
  getPatientById,
);

module.exports = router;
