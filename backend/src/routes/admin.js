const express = require("express");
const {
  getDashboardStats,
  getAnalytics,
  getAllDoctors,
  verifyDoctor,
  getAllPatients,
} = require("../controllers/adminController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/roleGuard");

const router = express.Router();
router.use(protect, authorize("admin"));

router.get("/dashboard", getDashboardStats);
router.get("/analytics", getAnalytics);
router.get("/doctors", getAllDoctors);
router.patch("/doctors/:id/verify", verifyDoctor);
router.get("/patients", getAllPatients);

module.exports = router;
