const { ApiError } = require("../utils/apiResponse");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for dev
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = `Resource not found`;
    error = new ApiError(404, message);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || err.keyPattern || {})[0] || "";
    const value = err.keyValue ? err.keyValue[field] : "";
    let message = "Duplicate field value entered";
    if (field === "email") {
      message = `An account with email "${value}" already exists. Please log in or use a different email.`;
    } else if (field === "doctorId") {
      message = `Doctor ID "${value}" is already registered. Please sign in or use your unique ID.`;
    } else if (field) {
      message = `${field.charAt(0).toUpperCase() + field.slice(1)} "${value}" is already in use.`;
    }
    error = new ApiError(400, message);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    error = new ApiError(400, message);
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    error = new ApiError(401, "Invalid token. Please log in again.");
  }

  if (err.name === "TokenExpiredError") {
    error = new ApiError(401, "Your token has expired. Please log in again.");
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Server Error",
    error: error.message || "Server Error",
  });
};

module.exports = errorHandler;
