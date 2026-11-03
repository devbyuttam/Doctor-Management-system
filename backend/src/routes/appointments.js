const express = require("express");
const {
  bookAppointment,
  getAppointments,
  getAppointmentById,
  updateStatus,
  reschedule,
  deleteAppointment,
} = require("../controllers/appointmentController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/roleGuard");

const router = express.Router();

router.use(protect);

router.post("/", authorize("patient", "receptionist"), bookAppointment);
router.get("/", getAppointments);
router.get("/:id", getAppointmentById);
router.patch("/:id/status", authorize("doctor", "admin"), updateStatus);
router.patch(
  "/:id/reschedule",
  authorize("patient", "receptionist"),
  reschedule,
);
router.delete("/:id", authorize("patient", "receptionist"), deleteAppointment);

module.exports = router;
