const User = require("../models/User");
const { ApiError } = require("../utils/apiResponse");
const catchAsync = require("../utils/catchAsync");
const bcrypt = require("bcryptjs");

exports.getProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("-passwordHash");
  res.status(200).json({ success: true, data: user });
});

exports.updateProfile = catchAsync(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    phone: req.body.phone,
    profileImage: req.body.profileImage,
  };

  const user = await User.findByIdAndUpdate(req.user._id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  }).select("-passwordHash");

  res.status(200).json({ success: true, data: user });
});

exports.changePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return next(new ApiError(400, "Please provide current and new password"));
  }

  const user = await User.findById(req.user._id).select("+passwordHash");
  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    return next(new ApiError(401, "Incorrect current password"));
  }

  user.passwordHash = newPassword; // Pre-save hook hashes it
  await user.save();

  res
    .status(200)
    .json({ success: true, message: "Password updated successfully" });
});
