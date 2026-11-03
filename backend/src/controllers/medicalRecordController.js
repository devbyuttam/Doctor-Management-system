const MedicalRecord = require("../models/MedicalRecord");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const { ApiError } = require("../utils/apiResponse");
const catchAsync = require("../utils/catchAsync");

exports.createRecord = catchAsync(async (req, res, next) => {
  const doctor = await Doctor.findOne({ userId: req.user._id });
  if (!doctor)
    return next(new ApiError(403, "Only doctors can create records"));

  const record = await MedicalRecord.create({
    ...req.body,
    doctorId: doctor._id,
  });
  res.status(201).json({ success: true, data: record });
});

exports.getRecords = catchAsync(async (req, res, next) => {
  let query = {};
  if (req.user.role === "patient") {
    const patient = await Patient.findOne({ userId: req.user._id });
    query.patientId = patient._id;
  } else if (req.user.role === "doctor") {
    const doctor = await Doctor.findOne({ userId: req.user._id });
    query.doctorId = doctor._id;
  }

  const records = await MedicalRecord.find(query).populate(
    "patientId doctorId appointmentId",
  );
  res.status(200).json({ success: true, count: records.length, data: records });
});

exports.getRecordById = catchAsync(async (req, res, next) => {
  const record = await MedicalRecord.findById(req.params.id).populate(
    "patientId doctorId",
  );
  if (!record) return next(new ApiError(404, "Record not found"));
  res.status(200).json({ success: true, data: record });
});
