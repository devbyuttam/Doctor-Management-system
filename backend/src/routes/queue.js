const express = require("express");
const {
  getQueue,
  updateQueueStatus,
  getQueueStatus,
} = require("../controllers/queueController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/roleGuard");

const router = express.Router();

router.get("/:doctorId/:date/status", getQueueStatus);

router.use(protect);
router.get("/:doctorId/:date", getQueue);
router.patch(
  "/:appointmentId/queue-status",
  authorize("doctor", "receptionist"),
  updateQueueStatus,
);

module.exports = router;
