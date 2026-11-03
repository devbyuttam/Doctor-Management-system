const catchAsync = require("../utils/catchAsync");

exports.uploadImage = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded" });
  }
  res.status(200).json({ success: true, url: req.file.path });
});

exports.uploadDocument = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "No document uploaded" });
  }
  res.status(200).json({ success: true, url: req.file.path });
});
