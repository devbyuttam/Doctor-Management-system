const Review = require("../models/Review");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const { ApiError } = require("../utils/apiResponse");
const catchAsync = require("../utils/catchAsync");

exports.createReview = catchAsync(async (req, res, next) => {
  const { appointmentId, rating, comment } = req.body;

  const patient = await Patient.findOne({ userId: req.user._id });
  const review = await Review.create({
    patientId: patient._id,
    doctorId: req.body.doctorId,
    appointmentId,
    rating,
    comment,
  });

  // Update doctor average rating
  const stats = await Review.aggregate([
    { $match: { doctorId: review.doctorId } },
    {
      $group: {
        _id: "$doctorId",
        avgRating: { $avg: "$rating" },
        numReviews: { $sum: 1 },
      },
    },
  ]);

  await Doctor.findByIdAndUpdate(review.doctorId, {
    averageRating: stats[0].avgRating,
    totalReviews: stats[0].numReviews,
  });

  res.status(201).json({ success: true, data: review });
});

exports.getDoctorReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({
    doctorId: req.params.doctorId,
    isVisible: true,
  }).populate({
    path: "patientId",
    populate: { path: "userId", select: "name profileImage" },
  });
  res.status(200).json({ success: true, count: reviews.length, data: reviews });
});

exports.getAppointmentReview = catchAsync(async (req, res, next) => {
  const review = await Review.findOne({
    appointmentId: req.params.appointmentId,
  });
  res.status(200).json({ success: true, data: review });
});
