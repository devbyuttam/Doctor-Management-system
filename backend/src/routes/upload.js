const express = require("express");
const {
  uploadImage,
  uploadDocument,
} = require("../controllers/uploadController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

router.use(protect);
router.post("/profile-image", upload.single("image"), uploadImage);
router.post("/document", upload.single("document"), uploadDocument);

module.exports = router;
