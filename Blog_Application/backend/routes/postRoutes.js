const express = require("express");
const router = express.Router();

const postController = require("../controllers/postController");
const protect = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleWare");
const postUpload = require("../middleware/postUploadMiddleware");
const checkBlocked = require("../middleware/checkBlocked");
const { createPostValidator, updatePostValidator } = require("../validators/postValidators");

// -----------------------Public routes --------------------------

// Get all posts
router.get("/", postController.getAllPosts);

// Get single post
router.get("/:id", postController.getPostById);


//----------------------Admin routes --------------------------

// Create new post
router.post("/", protect, checkBlocked, postUpload.single("image"), createPostValidator, postController.createPost);

// Update post
router.patch("/:id", protect, postUpload.single("image"), updatePostValidator, postController.updatePost);

// Delete post
router.delete("/:id", protect, postController.deletePost);

module.exports = router;