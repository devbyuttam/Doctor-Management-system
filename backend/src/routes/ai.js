const express = require("express");
const { chat, chatPublic } = require("../controllers/aiController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Authenticated chat (for logged-in patients/doctors)
router.post("/chat", protect, chat);

// Public chat (for visitors on the home page — no login required)
router.post("/chat/public", chatPublic);

module.exports = router;
