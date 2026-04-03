const express = require("express");
const router = express.Router();

const { generateAIResponse } = require("../controllers/aiController");
const protect = require("../middleware/authMiddleware");
const checkBlocked = require("../middleware/checkBlocked");

// Handle AI route
router.post("/", protect, checkBlocked, generateAIResponse);

module.exports = router;
