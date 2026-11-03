const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { ApiError } = require("../utils/apiResponse");
const catchAsync = require("../utils/catchAsync");

const protect = catchAsync(async (req, res, next) => {
  let token;

  if (req.cookies.token) {
    token = req.cookies.token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ApiError(401, "Not authorized to access this route"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-passwordHash");
    if (!req.user) {
      return next(new ApiError(401, "User no longer exists"));
    }
    if (req.user.status !== "active") {
      return next(new ApiError(403, "User account is not active"));
    }
    next();
  } catch (err) {
    return next(new ApiError(401, "Not authorized to access this route"));
  }
});

module.exports = { protect };
