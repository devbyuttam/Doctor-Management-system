const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { cloudinary, isConfigured } = require("../config/cloudinary");

let storage;

if (isConfigured) {
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "doctor_management_system",
      allowed_formats: ["jpg", "jpeg", "png", "pdf"],
    },
  });
} else {
  // Fallback to local storage if Cloudinary is not configured
  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/"); // Need to ensure this folder exists
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix + "-" + file.originalname);
    },
  });
}

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

module.exports = upload;
