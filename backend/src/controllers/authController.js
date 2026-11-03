const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const DoctorRegistry = require("../models/DoctorRegistry");
const { ensureDoctorRegistrySeeded } = require("../services/doctorRegistryService");
const { sendTokenResponse } = require("../utils/generateToken");
const { ApiError } = require("../utils/apiResponse");
const catchAsync = require("../utils/catchAsync");

/**
 * Verify a Hospital Doctor ID against the Pre-Authorized Registry of 100 Doctors
 * POST /api/auth/verify-doctor-id
 */
exports.verifyDoctorId = catchAsync(async (req, res, next) => {
  const { doctorId } = req.body;

  if (!doctorId || !doctorId.trim()) {
    return next(new ApiError(400, "Please provide a Doctor ID to verify"));
  }

  // Ensure registry is seeded
  await ensureDoctorRegistrySeeded();

  const cleanId = doctorId.trim().toUpperCase();
  const record = await DoctorRegistry.findOne({ doctorId: cleanId });

  if (!record) {
    return res.status(404).json({
      success: false,
      isAuthorized: false,
      message: `Doctor ID "${cleanId}" was not found in the Hospital Medical Board Registry. Only authorized doctors with a valid Doctor ID (e.g. DOC-1001 to DOC-1100) are permitted to register.`,
    });
  }

  if (record.isRegistered) {
    return res.status(409).json({
      success: false,
      isAuthorized: true,
      isRegistered: true,
      message: `Doctor ID "${cleanId}" (${record.name}) is already registered and activated. Please sign in to your Doctor Portal.`,
    });
  }

  return res.status(200).json({
    success: true,
    isAuthorized: true,
    isRegistered: false,
    message: `Doctor ID verified. Authorized for ${record.name} (${record.specialization}).`,
    data: {
      doctorId: record.doctorId,
      name: record.name,
      specialization: record.specialization,
      department: record.department,
      medicalLicenseNumber: record.medicalLicenseNumber,
      assignedEmail: record.assignedEmail,
      contactPhone: record.contactPhone,
      experience: record.experience,
      consultationFee: record.consultationFee,
      hospitalBranch: record.hospitalBranch,
    },
  });
});

/**
 * Get Hospital Doctor Registry list (Search & Directory)
 * GET /api/auth/doctor-registry
 */
exports.getDoctorRegistry = catchAsync(async (req, res) => {
  await ensureDoctorRegistrySeeded();

  const { search, status, limit = 100 } = req.query;
  const filter = {};

  if (status === "registered") {
    filter.isRegistered = true;
  } else if (status === "available" || status === "unregistered") {
    filter.isRegistered = false;
  }

  if (search) {
    const s = search.trim();
    filter.$or = [
      { doctorId: new RegExp(s, "i") },
      { name: new RegExp(s, "i") },
      { specialization: new RegExp(s, "i") },
      { department: new RegExp(s, "i") },
    ];
  }

  const list = await DoctorRegistry.find(filter)
    .sort({ doctorId: 1 })
    .limit(Number(limit));

  const total = await DoctorRegistry.countDocuments();
  const registeredCount = await DoctorRegistry.countDocuments({ isRegistered: true });

  res.status(200).json({
    success: true,
    total,
    registeredCount,
    availableCount: total - registeredCount,
    count: list.length,
    data: list,
  });
});

/**
 * Register User (Patient or Doctor)
 * POST /api/auth/register
 */
exports.register = catchAsync(async (req, res, next) => {
  const { name, email, password, role, phone, doctorId } = req.body;

  if (!["patient", "doctor"].includes(role)) {
    return next(new ApiError(400, "Invalid role for registration"));
  }

  // ── STRICT SECURITY CHECK FOR DOCTOR REGISTRATION ──
  let verifiedDoctor = null;
  if (role === "doctor") {
    if (!doctorId || !doctorId.trim()) {
      return next(
        new ApiError(
          403,
          "Access Denied: Doctor registration strictly requires an authorized Hospital Doctor ID (e.g. DOC-1001 to DOC-1100)."
        )
      );
    }

    await ensureDoctorRegistrySeeded();

    const cleanDoctorId = doctorId.trim().toUpperCase();
    verifiedDoctor = await DoctorRegistry.findOne({ doctorId: cleanDoctorId });

    if (!verifiedDoctor) {
      return next(
        new ApiError(
          403,
          `Access Denied: Doctor ID "${cleanDoctorId}" is not present in the pre-authorized Hospital Medical Board Registry. Only authorized hospital doctors can register.`
        )
      );
    }

    if (verifiedDoctor.isRegistered) {
      return next(
        new ApiError(
          409,
          `Doctor ID "${cleanDoctorId}" is already claimed and registered. If this is you, please sign in.`
        )
      );
    }
  }

  const cleanEmail = email.toLowerCase().trim();
  const userExists = await User.findOne({ email: cleanEmail });
  if (userExists) {
    return next(new ApiError(400, "Email already in use"));
  }

  // Create User
  const userData = {
    name: role === "doctor" ? (verifiedDoctor ? verifiedDoctor.name : name) : name,
    email: cleanEmail,
    passwordHash: password, // Pre-save hook hashes it
    role,
    phone: phone || (verifiedDoctor ? verifiedDoctor.contactPhone : ""),
  };

  if (role === "doctor" && verifiedDoctor) {
    userData.doctorId = verifiedDoctor.doctorId;
  }

  const user = await User.create(userData);

  if (role === "patient") {
    await Patient.create({ userId: user._id });
  } else if (role === "doctor") {
    await Doctor.create({
      userId: user._id,
      doctorId: verifiedDoctor.doctorId,
      specialization: verifiedDoctor.specialization || req.body.specialization || "General Physician",
      medicalLicenseNumber: verifiedDoctor.medicalLicenseNumber,
      experience: verifiedDoctor.experience || req.body.experience || 5,
      consultationFee: verifiedDoctor.consultationFee || req.body.consultationFee || 600,
      location: { city: "Delhi", state: "Delhi", country: "India" },
      verificationStatus: "approved",
      isAvailable: true,
    });

    // Mark registry as registered
    verifiedDoctor.isRegistered = true;
    verifiedDoctor.registeredAt = new Date();
    verifiedDoctor.registeredUserId = user._id;
    await verifiedDoctor.save();
  }

  sendTokenResponse(user, 201, res);
});

/**
 * Login User (Accepts Email OR Doctor ID for doctors)
 * POST /api/auth/login
 */
exports.login = catchAsync(async (req, res, next) => {
  const { email, doctorId, identifier, password } = req.body;
  const loginInput = (identifier || doctorId || email || "").trim();

  if (!loginInput || !password) {
    return next(new ApiError(400, "Please provide email or Doctor ID and password"));
  }

  // Check by email OR doctorId
  let query;
  if (loginInput.includes("@")) {
    query = { email: loginInput.toLowerCase() };
  } else {
    query = {
      $or: [
        { doctorId: loginInput.toUpperCase() },
        { email: loginInput.toLowerCase() },
      ],
    };
  }

  const user = await User.findOne(query).select("+passwordHash");
  if (!user) {
    return next(new ApiError(401, "Invalid credentials or Doctor ID not found"));
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ApiError(401, "Invalid credentials"));
  }

  if (user.status !== "active") {
    return next(new ApiError(403, "Account is not active"));
  }

  sendTokenResponse(user, 200, res);
});

exports.logout = catchAsync(async (req, res) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ success: true, data: {} });
});

exports.getMe = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id).select("-passwordHash");
  res.status(200).json({ success: true, data: user });
});
