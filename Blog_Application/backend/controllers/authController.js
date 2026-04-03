// controllers/authController.js
const authService = require("../services/authService");

// ================= REGISTER =================
const register = async (req, res, next) => {
  try {
    const result = await authService.registerUser(req.body);

    // Set access token in HTTP-only cookie
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    // Return user data + refresh token in JSON
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        _id: result._id,
        name: result.name,
        email: result.email,
        role: result.role,
        avatarUrl: result.avatarUrl || "",
        avatarThumbUrl: result.avatarThumbUrl || "",
        token: result.token,
        refreshToken: result.refreshToken, // long-lived
      },
    });
  } catch (error) {
    next(error); // send to centralized error middleware
  }
};

// ================= LOGIN =================
const login = async (req, res, next) => {
  try {
    const result = await authService.loginUser(req.body);

    // Set access token in HTTP-only cookie
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    // Return user data + refresh token in JSON
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        _id: result._id,
        name: result.name,
        email: result.email,
        role: result.role,
        avatarUrl: result.avatarUrl || "",
        avatarThumbUrl: result.avatarThumbUrl || "",
        token: result.token,
        refreshToken: result.refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ================= REFRESH TOKEN =================
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw new Error("No refresh token provided");

    const newAccessToken = await authService.refreshAccessToken(refreshToken);

    // Set new access token in HTTP-only cookie
    res.cookie("token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Access token refreshed",
    });
  } catch (error) {
    next(error);
  }
};

// ================= LOGOUT =================
const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    // Remove refresh token from user document
    await authService.logoutUser(refreshToken);

    // Clear access token cookie
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });

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
    const token = req.cookies?.token || (req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.split(" ")[1] : null);

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl || "",
        avatarThumbUrl: user.avatarThumbUrl || "",
        token: token,
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