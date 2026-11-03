const { validationResult } = require("express-validator");
const { ApiError } = require("../utils/apiResponse");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push(err.msg));
  return next(new ApiError(400, extractedErrors.join(", ")));
};

module.exports = { validate };
