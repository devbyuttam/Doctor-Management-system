const Doctor = require("../models/Doctor");
const User = require("../models/User");
const { getAvailableSlots } = require("../services/slotService");
const { ApiError } = require("../utils/apiResponse");
const catchAsync = require("../utils/catchAsync");

exports.getDoctors = catchAsync(async (req, res, next) => {
  const query = { verificationStatus: "approved" };

  // Filtering logic
  if (req.query.specialization) query.specialization = req.query.specialization;
  if (req.query.department) query.department = req.query.department;
  if (req.query.gender) query.gender = req.query.gender;
  if (req.query.minFee)
    query.consultationFee = {
      ...query.consultationFee,
      $gte: req.query.minFee,
    };
  if (req.query.maxFee)
    query.consultationFee = {
      ...query.consultationFee,
      $lte: req.query.maxFee,
    };

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;

  const doctors = await Doctor.find(query)
    .populate("userId", "name email phone profileImage")
    .populate("department", "name")
    .skip(startIndex)
    .limit(limit);

  const total = await Doctor.countDocuments(query);

  res
    .status(200)
    .json({
      success: true,
      count: doctors.length,
      pagination: { total, page, limit },
      data: doctors,
    });
});

exports.getDoctorById = catchAsync(async (req, res, next) => {
  const doctor = await Doctor.findById(req.params.id)
    .populate("userId", "name email phone profileImage")
    .populate("department", "name");
  if (!doctor) return next(new ApiError(404, "Doctor not found"));
  res.status(200).json({ success: true, data: doctor });
});

exports.getDoctorSlots = catchAsync(async (req, res, next) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) return next(new ApiError(404, "Doctor not found"));

  const date = req.query.date || new Date().toISOString().split("T")[0];
  const slots = await getAvailableSlots(doctor._id, date, doctor.availability);

  res.status(200).json({ success: true, date, data: slots });
});

exports.updateProfile = catchAsync(async (req, res, next) => {
  const fields = [
    "specialization",
    "department",
    "qualifications",
    "experience",
    "consultationFee",
    "about",
    "clinic",
    "location",
    "gender",
    "languages",
  ];
  const updateData = {};
  fields.forEach((f) => {
    if (req.body[f] !== undefined) updateData[f] = req.body[f];
  });

  const doctor = await Doctor.findOneAndUpdate(
    { userId: req.user._id },
    updateData,
    { new: true, runValidators: true },
  );
  res.status(200).json({ success: true, data: doctor });
});

exports.updateAvailability = catchAsync(async (req, res, next) => {
  const doctor = await Doctor.findOneAndUpdate(
    { userId: req.user._id },
    { availability: req.body.availability },
    { new: true, runValidators: true },
  );
  res.status(200).json({ success: true, data: doctor });
});

exports.getMe = catchAsync(async (req, res, next) => {
  const doctor = await Doctor.findOne({ userId: req.user._id }).populate(
    "userId",
    "name email phone profileImage",
  );
  res.status(200).json({ success: true, data: doctor });
});
