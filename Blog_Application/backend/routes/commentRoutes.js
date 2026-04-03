const express = require("express");
const router = express.Router();

const commentController = require("../controllers/commentController");
const protect = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleWare");
const checkBlocked = require("../middleware/checkBlocked");
const { createCommentValidator } = require("../validators/commentValidators");

// Add comment (any logged-in user, but not blocked)
router.post("/", protect, checkBlocked, createCommentValidator, commentController.createComment);

// Get comments for a post
router.get("/:postId", commentController.getCommentsByPost);

// Delete comment (admin and superadmin only)
router.delete("/:commentId", protect, roleMiddleware("admin", "superadmin"), commentController.deleteComment);

module.exports = router;