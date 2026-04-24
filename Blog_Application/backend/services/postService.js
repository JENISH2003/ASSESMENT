const Post = require("../models/Post");
const AppError = require("../utils/AppError");

// Create a new post
const createPost = async ({ title, content, author, tags = [], imageUrl = "" }) => {
  const post = await Post.create({
    title,
    content,
    author,
    tags,
    imageUrl,
  });

  const BlogHistory = require("../models/BlogHistory");
  await BlogHistory.create({
    userId: author,
    blogId: post._id,
    blogTitle: post.title,
    action: "Created"
  });

  return post;
};

// Get all posts (Paginated)
const getAllPosts = async ({ authorId, page = 1, limit = 20, search, tag }) => {
  const skip = (page - 1) * limit;
  const query = { isDeleted: false };
  
  if (authorId) query.author = authorId;
  if (tag && tag !== "all") query.tags = tag;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } }
    ];
  }

  const sortOptions = { createdAt: -1 }; // Sort by newest
  const projection = {}; // Standard projection

  const [posts, totalDocuments] = await Promise.all([
    Post.find(query, projection)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .populate("author", "name email avatarUrl avatarThumbUrl")
      .lean(),
    Post.countDocuments(query)
  ]);

  return { posts, totalDocuments, page, limit };
};

// Get post by ID
const getPostById = async (postId) => {
  const post = await Post.findByIdAndUpdate(
    postId, 
    { $inc: { views: 1 } }, 
    { new: true }
  ).populate("author", "name email avatarUrl avatarThumbUrl");

  if (!post || post.isDeleted) {
    throw new AppError("Post not found", 404);
  }

  return post;
};

// Update post
const updatePost = async (postId, updateData, user) => {
  const post = await Post.findById(postId);

  if (!post || post.isDeleted) {
    throw new AppError("Post not found", 404);
  }

  // Authorization check: User must be author OR admin OR superadmin
  if (post.author.toString() !== user._id.toString() && user.role !== "admin" && user.role !== "superadmin") {
    throw new AppError("You do not have permission to edit this post", 403);
  }

  const allowedFields = ["title", "content", "tags", "isPublished", "imageUrl"];
  const updateKeys = Object.keys(updateData);
  const invalidFields = updateKeys.filter((key) => !allowedFields.includes(key));
  if (invalidFields.length > 0) {
    throw new AppError(`Invalid update fields: ${invalidFields.join(", ")}`, 400);
  }

  if (updateKeys.length === 0) {
    throw new AppError("At least one field is required to update", 400);
  }

  updateKeys.forEach((key) => {
    post[key] = updateData[key];
  });

  await post.save();

  const BlogHistory = require("../models/BlogHistory");
  await BlogHistory.create({
    userId: user._id,
    blogId: post._id,
    blogTitle: post.title,
    action: "Updated"
  });

  return post;
};

// Delete post
const deletePost = async (postId, user) => {
  const post = await Post.findById(postId);

  if (!post || post.isDeleted) {
    throw new AppError("Post not found", 404);
  }

  // Authorization check: User must be  admin OR superadmin
  if (post.author.toString() !== user._id.toString() && user.role !== "admin" && user.role !== "superadmin") {
    throw new AppError("You do not have permission to delete this post", 403);
  }

  // Soft delete: hide the post from the application but keep data in database
  post.isDeleted = true;
  await post.save();

  const BlogHistory = require("../models/BlogHistory");
  await BlogHistory.create({
    userId: user._id,
    blogId: post._id,
    blogTitle: post.title,
    action: "Deleted"
  });

  return { message: "Post deleted successfully" };
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
};