const User = require("../models/User");
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/generateToken");
const generateRefreshToken = require("../utils/generateRefreshToken");
const AppError = require("../utils/AppError");

// ================= REGISTER USER =================
const registerUser = async ({ name, email, password }) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("User already exists with this email", 409);
  }

  // Strong password validation
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!strongPasswordRegex.test(password)) {
    throw new AppError("Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.", 400);
  }


  // Determine role based on ADMIN_EMAIL environment variable
  const role = process.env.ADMIN_EMAIL && email === process.env.ADMIN_EMAIL ? "admin" : "user";

  // Create new user
  const user = await User.create({ name, email, password, role });

  // Generate access token
  const token = generateToken(user._id);

  // Generate refresh token
  const refreshToken = generateRefreshToken(user._id);

  // Save refresh token in user document for multi-device login
  user.refreshTokens.push(refreshToken);
  await user.save();

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatarUrl: user.avatarUrl,
    avatarThumbUrl: user.avatarThumbUrl,
    token,        // access token
    refreshToken, // refresh token
  };
};

// ================= LOGIN USER =================
const loginUser = async ({ email, password }) => {
  // Find user with password
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  // Compare password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  // Generate tokens
  const token = generateToken(user._id);               // short-lived access token
  const refreshToken = generateRefreshToken(user._id); // long-lived refresh token

  // Save refresh token for multi-device login
  user.refreshTokens.push(refreshToken);
  await user.save();

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatarUrl: user.avatarUrl,
    avatarThumbUrl: user.avatarThumbUrl,
    token,
    refreshToken,
  };
};

const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) throw new AppError("No refresh token provided", 400);

  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new AppError("Server misconfiguration: JWT_REFRESH_SECRET missing", 500);
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, secret);
  } catch (error) {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  const user = await User.findById(decoded.id);
  if (!user) throw new AppError("User not found", 404);

  const tokenExists = user.refreshTokens.includes(refreshToken);
  if (!tokenExists) {
    throw new AppError("Refresh token revoked or invalid", 401);
  }

  return generateToken(user._id);
};

// ================= LOGOUT USER =================
const logoutUser = async (refreshToken) => {
  if (!refreshToken) throw new AppError("No refresh token provided", 400);

  // Find user who has this refresh token
  const user = await User.findOne({ refreshTokens: refreshToken });
  if (user) {
    // Remove the refresh token (logout for that device)
    user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
    await user.save();
  }

  return { message: "Logged out successfully" };
};

module.exports = { registerUser, loginUser, refreshAccessToken, logoutUser };