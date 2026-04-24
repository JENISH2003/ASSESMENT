const User = require("../models/User");
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/generateToken");
const generateRefreshToken = require("../utils/generateRefreshToken");
const AppError = require("../utils/AppError");
const crypto = require("crypto"); // 1. Import crypto

// Super simple wrapper to hash the token quickly
const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

// ================= REGISTER USER =================
const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("User already exists with this email", 409);
  }

  // Strong password validation
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!strongPasswordRegex.test(password)) {
    throw new AppError("Password must be at least 8 characters long", 400);
  }

  const role =
    process.env.ADMIN_EMAIL && email === process.env.ADMIN_EMAIL
      ? "admin"
      : "user";
  const user = await User.create({ name, email, password, role });

  const token = generateToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // 2. Wrap the token in hashToken() before saving
  user.refreshTokens.push(hashToken(refreshToken));
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

// ================= LOGIN USER =================
const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new AppError("Invalid email or password", 401);

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new AppError("Invalid email or password", 401);

  const token = generateToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // 2. Wrap the token in hashToken() before storing
  user.refreshTokens.push(hashToken(refreshToken));
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

// ================= REFRESH TOKEN ROTATION =================
const refreshAccessToken = async (rawRefreshToken) => {
  if (!rawRefreshToken) throw new AppError("No refresh token provided", 400);

  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret)
    throw new AppError(
      "Server misconfiguration: JWT_REFRESH_SECRET missing",
      500,
    );

  let decoded;
  try {
    decoded = jwt.verify(rawRefreshToken, secret);
  } catch (error) {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  const user = await User.findById(decoded.id);
  if (!user) throw new AppError("User not found", 404);

  // 3. Hash the raw token the user gave us to see if it matches the DB
  const hashedRawToken = hashToken(rawRefreshToken);
  if (!user.refreshTokens.includes(hashedRawToken)) {
    throw new AppError("Refresh token is invalid or already used", 401);
  }

  // Generate new pair
  const newToken = generateToken(user._id);
  const newRefreshToken = generateRefreshToken(user._id);

  // 4. Remove the old hashed token, and insert the new hashed token
  user.refreshTokens = user.refreshTokens.filter((t) => t !== hashedRawToken);
  user.refreshTokens.push(hashToken(newRefreshToken));
  await user.save();

  return { token: newToken, refreshToken: newRefreshToken };
};

// ================= LOGOUT USER =================
const logoutUser = async (rawRefreshToken) => {
  if (!rawRefreshToken) return { message: "No token to clear" };

  try {
    const secret = process.env.JWT_REFRESH_SECRET;
    const decoded = jwt.verify(rawRefreshToken, secret);

    const user = await User.findById(decoded.id);
    if (user) {
      // 5. Hash it so we remove the correct one from the DB
      user.refreshTokens = user.refreshTokens.filter(
        (t) => t !== hashToken(rawRefreshToken),
      );
      await user.save();
    }
  } catch (error) {
    console.error("Critical error during logout:", error);
  }

  return { message: "Logged out successfully" };
};

module.exports = { registerUser, loginUser, refreshAccessToken, logoutUser };
