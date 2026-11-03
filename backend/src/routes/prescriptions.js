const express = require("express");
const {
  createPrescription,
  getPrescriptions,
  getPrescriptionPdf,
} = require("../controllers/prescriptionController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/roleGuard");

const router = express.Router();
router.use(protect);
router.post("/", authorize("doctor"), createPrescription);
router.get("/", getPrescriptions);
router.get("/:id/pdf", getPrescriptionPdf);
module.exports = router;
