const express = require("express");
const {
  createReview,
  getDoctorReviews,
  getAppointmentReview,
} = require("../controllers/reviewController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/roleGuard");

const router = express.Router();

router.get("/doctor/:doctorId", getDoctorReviews);

router.use(protect);
router.post("/", authorize("patient"), createReview);
router.get("/appointment/:appointmentId", getAppointmentReview);

module.exports = router;
