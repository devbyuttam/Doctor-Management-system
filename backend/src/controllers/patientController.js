const Patient = require("../models/Patient");
const { ApiError } = require("../utils/apiResponse");
const catchAsync = require("../utils/catchAsync");

exports.getPatients = catchAsync(async (req, res, next) => {
  const patients = await Patient.find().populate(
    "userId",
    "name email phone profileImage status",
  );
  res
    .status(200)
    .json({ success: true, count: patients.length, data: patients });
});

exports.getPatientById = catchAsync(async (req, res, next) => {
  const patient = await Patient.findById(req.params.id).populate(
    "userId",
    "name email phone profileImage",
  );
  if (!patient) return next(new ApiError(404, "Patient not found"));
  res.status(200).json({ success: true, data: patient });
});

exports.getMe = catchAsync(async (req, res, next) => {
  const patient = await Patient.findOne({ userId: req.user._id }).populate(
    "userId",
    "name email phone profileImage",
  );
  res.status(200).json({ success: true, data: patient });
});

exports.updateProfile = catchAsync(async (req, res, next) => {
  const fields = [
    "dateOfBirth",
    "gender",
    "bloodGroup",
    "address",
    "emergencyContact",
  ];
  const updateData = {};
  fields.forEach((f) => {
    if (req.body[f] !== undefined) updateData[f] = req.body[f];
  });

  const patient = await Patient.findOneAndUpdate(
    { userId: req.user._id },
    updateData,
    { new: true, runValidators: true },
  );
  res.status(200).json({ success: true, data: patient });
});
