const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const {
  registerValidator,
  loginValidator,
  refreshTokenValidator,
  logoutValidator,
} = require("../validators/authValidators");

const protect = require("../middleware/authMiddleware");

// Get current user
router.get("/me", protect, authController.getMe);

// Register
router.post("/register", registerValidator, authController.register);

// Login
router.post("/login", loginValidator, authController.login);

// Refresh token
router.post("/refresh-token", refreshTokenValidator, authController.refreshToken);

// Logout
router.post("/logout", logoutValidator, authController.logout);

module.exports = router;