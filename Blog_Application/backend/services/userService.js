const User = require("../models/User");
const cloudinary = require("../config/cloudinary");
const AppError = require("../utils/AppError");

const buildThumbnailUrl = (publicId) =>
  cloudinary.url(publicId, {
    width: 120,
    height: 120,
    crop: "fill",
    gravity: "face",
    quality: "auto",
    fetch_format: "auto",
  });

const updateProfilePicture = async (userId, file) => {
  if (!file) {
    throw new AppError("Profile image file is required", 400);
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const oldPublicId = user.avatarPublicId;
  const newPublicId = file.filename;
  const newAvatarUrl = file.path;
  const newThumbUrl = buildThumbnailUrl(newPublicId);

  user.avatarPublicId = newPublicId;
  user.avatarUrl = newAvatarUrl;
  user.avatarThumbUrl = newThumbUrl;
  await user.save();

  if (oldPublicId) {
    await cloudinary.uploader.destroy(oldPublicId);
  }

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatarUrl: user.avatarUrl,
    avatarThumbUrl: user.avatarThumbUrl,
  };
};

// Superadmin functions
const getAllUsers = async () => {
  return await User.find({}).select("-password");
};

const getUserById = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) throw new AppError("User not found", 404);
  return user;
};

const updateUser = async (userId, updateData) => {
  if (updateData.password) {
    throw new AppError("Cannot auto-update password here", 400); // Usually handled in auth
  }
  const user = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true }).select("-password");
  if (!user) throw new AppError("User not found", 404);
  return user;
};

const deleteUser = async (userId) => {
  const user = await User.findByIdAndDelete(userId);
  if (!user) throw new AppError("User not found", 404);
  return { message: "User deleted successfully" };
};

const toggleBlockStatus = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) throw new AppError("User not found", 404);
  user.isBlocked = !user.isBlocked;
  await user.save();
  return user;
};

module.exports = {
  updateProfilePicture,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleBlockStatus,
};
