const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "blog_application/posts",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "avif"],
    resource_type: "image",
  },
});

const postUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = postUpload;
