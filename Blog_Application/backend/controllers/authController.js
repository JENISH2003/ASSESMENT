// controllers/authController.js
const authService = require("../services/authService");

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
};

// We ONLY need options for the Refresh Token now!
const refreshTokenOptions = { 
  ...cookieOptions, 
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days 
};

// ================= REGISTER =================
const register = async (req, res, next) => {
  try {
    const result = await authService.registerUser(req.body);

    // Rule: Set Refresh Token in Secure Cookie
    res.cookie("refreshToken", result.refreshToken, refreshTokenOptions);

    // Rule: Send Access Token directly in JSON Response Body
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token: result.token, // This is the Access Token
      data: {
        _id: result._id,
        name: result.name,
        email: result.email,
        role: result.role,
        avatarUrl: result.avatarUrl || "",
        avatarThumbUrl: result.avatarThumbUrl || "",
      },
    });
  } catch (error) {
    next(error);
  }
};

// ================= LOGIN =================
const login = async (req, res, next) => {
  try {
    const result = await authService.loginUser(req.body);

    // Rule: Set Refresh Token in Secure Cookie
    res.cookie("refreshToken", result.refreshToken, refreshTokenOptions);

    // Rule: Send Access Token directly in JSON Response Body
    res.status(200).json({
      success: true,
      message: "Login successful",
      token: result.token, // This is the Access Token
      data: {
        _id: result._id,
        name: result.name,
        email: result.email,
        role: result.role,
        avatarUrl: result.avatarUrl || "",
        avatarThumbUrl: result.avatarThumbUrl || "",
      },
    });
  } catch (error) {
    next(error);
  }
};

// ================= REFRESH TOKEN =================
const refreshToken = async (req, res, next) => {
  try {
    // Read the old refresh token from the browser cookie
    const rawRefreshToken = req.cookies?.refreshToken;
    if (!rawRefreshToken) {
      return res.status(401).json({ success: false, message: "No refresh token provided" });
    }

    // This will rotate the token in the database and return a new pair
    const { token: newAccessToken, refreshToken: newRefreshToken } = await authService.refreshAccessToken(rawRefreshToken);

    // Set the NEW Refresh Token in the Cookie
    res.cookie("refreshToken", newRefreshToken, refreshTokenOptions);

    // Send the NEW Access Token directly in the JSON Response
    res.status(200).json({
      success: true,
      message: "Access and refresh tokens rotated successfully",
      token: newAccessToken, // Frontend will save this in its memory
    });
  } catch (error) {
    next(error);
  }
};

// ================= LOGOUT =================
const logout = async (req, res, next) => {
  try {
    const rawRefreshToken = req.cookies?.refreshToken;

    // Remove specific refresh token from user document in the database
    if (rawRefreshToken) {
      await authService.logoutUser(rawRefreshToken);
    }

    // Clear ONLY the Refresh Token Cookie (since the Access Token cookie doesn't exist anymore)
    res.cookie("refreshToken", "", { ...cookieOptions, maxAge: 0 });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ================= GET ME =================
const getMe = async (req, res, next) => {
  try {
    const user = req.user;

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl || "",
        avatarThumbUrl: user.avatarThumbUrl || "",
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  getMe,
};