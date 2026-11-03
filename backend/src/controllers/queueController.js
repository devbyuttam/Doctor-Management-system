const Appointment = require("../models/Appointment");
const { emitToQueue } = require("../services/socketService");
const { ApiError } = require("../utils/apiResponse");
const catchAsync = require("../utils/catchAsync");

exports.getQueue = catchAsync(async (req, res, next) => {
  const { doctorId, date } = req.params;

  const startOfDay = new Date(date);
  startOfDay.setUTCHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setUTCHours(23, 59, 59, 999);

  const queue = await Appointment.find({
    doctorId,
    date: { $gte: startOfDay, $lte: endOfDay },
    status: { $nin: ["cancelled", "rejected"] },
  })
    .sort({ tokenNumber: 1 })
    .populate({
      path: "patientId",
      populate: { path: "userId", select: "name" },
    });

  res.status(200).json({ success: true, count: queue.length, data: queue });
});

exports.updateQueueStatus = catchAsync(async (req, res, next) => {
  const { queueStatus } = req.body;
  const appointment = await Appointment.findById(req.params.appointmentId);
  if (!appointment) return next(new ApiError(404, "Appointment not found"));

  appointment.queueStatus = queueStatus;
  if (queueStatus === "completed") {
    appointment.status = "completed";
  }
  await appointment.save();

  emitToQueue(
    appointment.doctorId,
    appointment.date.toISOString().split("T")[0],
    "queue:updated",
    appointment,
  );

  res.status(200).json({ success: true, data: appointment });
});

exports.getQueueStatus = catchAsync(async (req, res, next) => {
  const { doctorId, date } = req.params;
  const startOfDay = new Date(date);
  startOfDay.setUTCHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setUTCHours(23, 59, 59, 999);

  const currentAppt = await Appointment.findOne({
    doctorId,
    date: { $gte: startOfDay, $lte: endOfDay },
    queueStatus: "in_consultation",
  });

  const waitingCount = await Appointment.countDocuments({
    doctorId,
    date: { $gte: startOfDay, $lte: endOfDay },
    queueStatus: "waiting",
  });

  res.status(200).json({
    success: true,
    data: {
      currentToken: currentAppt ? currentAppt.tokenNumber : null,
      waitingCount,
      estimatedWaitTimeMinutes: waitingCount * 15, // Rough estimate
    },
  });
});
