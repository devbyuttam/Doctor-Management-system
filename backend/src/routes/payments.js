const express = require("express");
const {
  createPaymentOrder,
  verifyPayment,
  getPaymentHistory,
} = require("../controllers/paymentController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/roleGuard");

const router = express.Router();
router.use(protect);
router.post("/create-order", authorize("patient"), createPaymentOrder);
router.post("/verify", authorize("patient"), verifyPayment);
router.get("/history", getPaymentHistory);
module.exports = router;
