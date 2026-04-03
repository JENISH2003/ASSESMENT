const validateRequest = require("../middleware/validateRequest");

const registerValidator = validateRequest({
  name: { required: true, type: "string", minLength: 2 },
  email: { required: true, type: "string", email: true },
  password: { required: true, type: "string", minLength: 6 },
});

const loginValidator = validateRequest({
  email: { required: true, type: "string", email: true },
  password: { required: true, type: "string", minLength: 6 },
});

const refreshTokenValidator = validateRequest({
  refreshToken: { required: true, type: "string", minLength: 10 },
});

const logoutValidator = validateRequest({
  refreshToken: { required: true, type: "string", minLength: 10 },
});

module.exports = {
  registerValidator,
  loginValidator,
  refreshTokenValidator,
  logoutValidator,
};
