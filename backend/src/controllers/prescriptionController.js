const Prescription = require("../models/Prescription");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const { generatePrescriptionPdf } = require("../utils/pdfGenerator");
const { ApiError } = require("../utils/apiResponse");
const catchAsync = require("../utils/catchAsync");

exports.createPrescription = catchAsync(async (req, res, next) => {
  const doctor = await Doctor.findOne({ userId: req.user._id });
  if (!doctor) return next(new ApiError(403, "Not authorized"));

  const prescription = await Prescription.create({
    ...req.body,
    doctorId: doctor._id,
  });
  res.status(201).json({ success: true, data: prescription });
});

exports.getPrescriptions = catchAsync(async (req, res, next) => {
  let query = {};
  if (req.user.role === "patient") {
    const patient = await Patient.findOne({ userId: req.user._id });
    query.patientId = patient._id;
  } else if (req.user.role === "doctor") {
    const doctor = await Doctor.findOne({ userId: req.user._id });
    query.doctorId = doctor._id;
  }

  const prescriptions =
    await Prescription.find(query).populate("doctorId patientId");
  res
    .status(200)
    .json({ success: true, count: prescriptions.length, data: prescriptions });
});

exports.getPrescriptionPdf = catchAsync(async (req, res, next) => {
  const prescription = await Prescription.findById(req.params.id)
    .populate({
      path: "doctorId",
      populate: { path: "userId", select: "name" },
    })
    .populate({
      path: "patientId",
      populate: { path: "userId", select: "name" },
    });

  if (!prescription) return next(new ApiError(404, "Prescription not found"));

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=prescription-${prescription._id}.pdf`,
  );

  generatePrescriptionPdf(
    prescription,
    prescription.doctorId,
    prescription.patientId,
    res,
  );
});
