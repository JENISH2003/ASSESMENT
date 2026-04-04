const userService = require("../services/userService");

const uploadProfilePicture = async (req, res, next) => {
  try {
    const user = await userService.updateProfilePicture(req.user._id, req.file);

    res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Superadmin Endpoints

const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    res.status(200).json({ success: true, message: "User updated successfully", data: user });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const result = await userService.deleteUser(req.params.id);
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    next(error);
  }
};

const toggleBlockStatus = async (req, res, next) => {
  try {
    const user = await userService.toggleBlockStatus(req.params.id);
    const statusMsg = user.isBlocked ? "blocked" : "unblocked";
    res.status(200).json({
      success: true,
      message: `User is now ${statusMsg}`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const getUserHistory = async (req, res, next) => {
  try {
    const historyData = await userService.getUserHistory(req.params.id);
    res.status(200).json({ success: true, data: historyData });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadProfilePicture,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleBlockStatus,
  getUserHistory,
};
