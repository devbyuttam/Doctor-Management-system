const express = require("express");
const {
  createRecord,
  getRecords,
  getRecordById,
} = require("../controllers/medicalRecordController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/roleGuard");

const router = express.Router();
router.use(protect);
router.post("/", authorize("doctor"), createRecord);
router.get("/", getRecords);
router.get("/:id", getRecordById);
module.exports = router;
