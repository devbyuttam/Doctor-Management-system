const Payment = require("../models/Payment");
const Patient = require("../models/Patient");
const Appointment = require("../models/Appointment");
const {
  createOrder,
  verifySignature,
  isConfigured,
} = require("../services/paymentService");
const { ApiError } = require("../utils/apiResponse");
const catchAsync = require("../utils/catchAsync");

exports.createPaymentOrder = catchAsync(async (req, res, next) => {
  if (!isConfigured) {
    return res.status(200).json({ success: true, data: { configured: false } });
  }

  const { amount, appointmentId } = req.body;
  const patient = await Patient.findOne({ userId: req.user._id });

  const order = await createOrder(amount, appointmentId);

  const payment = await Payment.create({
    patientId: patient._id,
    appointmentId,
    amount,
    razorpayOrderId: order.id,
  });

  res
    .status(200)
    .json({ success: true, data: { order, paymentId: payment._id } });
});

exports.verifyPayment = catchAsync(async (req, res, next) => {
  if (!isConfigured) {
    return res.status(200).json({ success: true, data: { configured: false } });
  }

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    paymentId,
  } = req.body;

  const isValid = verifySignature(
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  );
  if (!isValid) {
    return next(new ApiError(400, "Invalid signature"));
  }

  const payment = await Payment.findById(paymentId);
  payment.status = "paid";
  payment.razorpayPaymentId = razorpay_payment_id;
  await payment.save();

  await Appointment.findByIdAndUpdate(payment.appointmentId, {
    paymentStatus: "paid",
  });

  res.status(200).json({ success: true, data: payment });
});

exports.getPaymentHistory = catchAsync(async (req, res, next) => {
  let query = {};
  if (req.user.role === "patient") {
    const patient = await Patient.findOne({ userId: req.user._id });
    query.patientId = patient._id;
  }
  const payments = await Payment.find(query).populate("appointmentId");
  res
    .status(200)
    .json({ success: true, count: payments.length, data: payments });
});
