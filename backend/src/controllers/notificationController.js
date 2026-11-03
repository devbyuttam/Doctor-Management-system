const Notification = require("../models/Notification");
const catchAsync = require("../utils/catchAsync");

exports.getNotifications = catchAsync(async (req, res, next) => {
  const notifications = await Notification.find({ userId: req.user._id }).sort({
    createdAt: -1,
  });
  res
    .status(200)
    .json({ success: true, count: notifications.length, data: notifications });
});

exports.markAsRead = catchAsync(async (req, res, next) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { read: true },
    { new: true },
  );
  res.status(200).json({ success: true, data: notification });
});

exports.markAllAsRead = catchAsync(async (req, res, next) => {
  await Notification.updateMany({ userId: req.user._id }, { read: true });
  res.status(200).json({ success: true, data: {} });
});

exports.deleteNotification = catchAsync(async (req, res, next) => {
  await Notification.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });
  res.status(200).json({ success: true, data: {} });
});
