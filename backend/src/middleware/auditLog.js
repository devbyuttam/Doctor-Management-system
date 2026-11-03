const catchAsync = require("../utils/catchAsync");

const auditLog = (action) =>
  catchAsync(async (req, res, next) => {
    // Simple audit logging middleware
    console.log(
      `[AUDIT] User: ${req.user?._id} | Role: ${req.user?.role} | Action: ${action} | Time: ${new Date().toISOString()}`,
    );
    next();
  });

module.exports = auditLog;
