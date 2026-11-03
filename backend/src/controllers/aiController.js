const { getChatResponse, isConfigured } = require("../services/aiService");
const Doctor = require("../models/Doctor");
const catchAsync = require("../utils/catchAsync");

// Helper: fetch approved doctors for AI context
const getApprovedDoctors = async () => {
  const doctors = await Doctor.find({ verificationStatus: "approved" }).populate("userId", "name");
  return doctors.map((d) => ({
    name: d.userId?.name || "Doctor",
    specialization: d.specialization,
    fee: d.consultationFee,
    experience: d.experience,
    rating: d.averageRating,
    languages: d.languages,
    location: d.location?.city,
  }));
};

// POST /api/ai/chat  (protected — logged-in users)
exports.chat = catchAsync(async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ success: false, message: "Message is required" });
  }

  if (!isConfigured) {
    return res.status(200).json({
      success: true,
      data: {
        configured: false,
        response:
          "The AI assistant is not configured yet. Please ask your administrator to add the GEMINI_API_KEY to the server environment.",
      },
    });
  }

  const doctorsData = await getApprovedDoctors();
  const result = await getChatResponse(message.trim(), doctorsData, history);

  res.status(200).json({ success: true, data: result });
});

// POST /api/ai/chat/public  (no auth — for public visitors)
exports.chatPublic = catchAsync(async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ success: false, message: "Message is required" });
  }

  if (!isConfigured) {
    return res.status(200).json({
      success: true,
      data: {
        configured: false,
        response:
          "The AI assistant is not configured yet. Please contact support.",
      },
    });
  }

  const doctorsData = await getApprovedDoctors();
  const result = await getChatResponse(message.trim(), doctorsData, history);

  res.status(200).json({ success: true, data: result });
});
