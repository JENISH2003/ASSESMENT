const express = require("express");
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const roleMiddleware = require("../middleware/roleMiddleWare");
const userController = require("../controllers/userController");

const router = express.Router();

router.patch(
  "/profile-picture",
  protect,
  upload.single("avatar"),
  userController.uploadProfilePicture
);

// --- Superadmin Routes ---
// These routes are restricted to the "superadmin" role
router.get("/", protect, roleMiddleware("superadmin"), userController.getAllUsers);
router.get("/:id", protect, roleMiddleware("superadmin"), userController.getUserById);
router.put("/:id", protect, roleMiddleware("superadmin"), userController.updateUser);
router.delete("/:id", protect, roleMiddleware("superadmin"), userController.deleteUser);
router.patch("/:id/block", protect, roleMiddleware("superadmin"), userController.toggleBlockStatus);
router.get("/:id/history", protect, roleMiddleware("superadmin"), userController.getUserHistory);

module.exports = router;
