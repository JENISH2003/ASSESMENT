const AppError = require("../utils/AppError");

const validateRequest = (schema) => (req, res, next) => {
  const errors = [];
  const source = req.body || {};

  Object.entries(schema).forEach(([field, rule]) => {
    const value = source[field];
    const isMissing = value === undefined || value === null || value === "";

    if (rule.required && isMissing) {
      errors.push(`${field} is required`);
      return;
    }

    if (isMissing) return;

    if (rule.type === "string" && typeof value !== "string") {
      errors.push(`${field} must be a string`);
      return;
    }

    if (rule.type === "array" && !Array.isArray(value)) {
      errors.push(`${field} must be an array`);
      return;
    }

    if (rule.minLength && typeof value === "string" && value.trim().length < rule.minLength) {
      errors.push(`${field} must be at least ${rule.minLength} characters`);
    }

    if (rule.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (typeof value !== "string" || !emailRegex.test(value)) {
        errors.push(`${field} must be a valid email`);
      }
    }
  });

  if (errors.length > 0) {
    return next(new AppError(errors.join(", "), 400));
  }

  return next();
};

module.exports = validateRequest;
