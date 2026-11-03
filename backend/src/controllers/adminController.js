const User = require("../models/User");
const Appointment = require("../models/Appointment");
const Payment = require("../models/Payment");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const { ApiError } = require("../utils/apiResponse");
const catchAsync = require("../utils/catchAsync");

exports.getDashboardStats = catchAsync(async (req, res, next) => {
  const usersByRole = await User.aggregate([
    { $group: { _id: "$role", count: { $sum: 1 } } },
  ]);

  const appointmentsByStatus = await Appointment.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setUTCHours(23, 59, 59, 999);

  const todaysAppointments = await Appointment.countDocuments({
    date: { $gte: startOfDay, $lte: endOfDay },
  });

  const totalRevenue = await Payment.aggregate([
    { $match: { status: "paid" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  res.status(200).json({
    success: true,
    data: {
      usersByRole,
      appointmentsByStatus,
      todaysAppointments,
      totalRevenue: totalRevenue[0]?.total || 0,
    },
  });
});

exports.getAnalytics = catchAsync(async (req, res, next) => {
  // Aggregate appointments by month
  const appointmentsByMonth = await Appointment.aggregate([
    { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);

  // Specialization breakdown
  const appointmentsBySpecialization = await Appointment.aggregate([
    {
      $lookup: {
        from: "doctors",
        localField: "doctorId",
        foreignField: "_id",
        as: "doctor",
      },
    },
    { $unwind: "$doctor" },
    { $group: { _id: "$doctor.specialization", count: { $sum: 1 } } },
  ]);

  res.status(200).json({
    success: true,
    data: {
      appointmentsByMonth,
      appointmentsBySpecialization,
    },
  });
});

exports.getAllDoctors = catchAsync(async (req, res, next) => {
  const doctors = await Doctor.find().populate(
    "userId",
    "name email phone status",
  );
  res.status(200).json({ success: true, count: doctors.length, data: doctors });
});

exports.verifyDoctor = catchAsync(async (req, res, next) => {
  const doctor = await Doctor.findByIdAndUpdate(
    req.params.id,
    { verificationStatus: req.body.status },
    { new: true },
  );
  res.status(200).json({ success: true, data: doctor });
});

exports.getAllPatients = catchAsync(async (req, res, next) => {
  const patients = await Patient.find().populate(
    "userId",
    "name email phone status",
  );
  res
    .status(200)
    .json({ success: true, count: patients.length, data: patients });
});
