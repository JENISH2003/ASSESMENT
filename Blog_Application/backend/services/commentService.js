const Comment = require("../models/Comment");
const Post = require("../models/Post");
const AppError = require("../utils/AppError");

// Create comment
const createComment = async ({ content, author, postId }) => {
  // Check if post exists
  const post = await Post.findById(postId);
  if (!post) throw new AppError("Post not found", 404);

  const comment = await Comment.create({
    content,
    author,
    post: postId,
  });

  return {
    _id: comment._id,
    content: comment.content,
    author: comment.author,
    post: comment.post,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
  };
};

// Get comments for a post
const getCommentsByPost = async (postId) => {
  const comments = await Comment.find({ post: postId })
    .populate("author", "name email avatarUrl avatarThumbUrl")
    .sort({ createdAt: -1 });

  return comments.map(comment => ({
    _id: comment._id,
    content: comment.content,
    author: comment.author,
    post: comment.post,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
  }));
};

// Delete comment
const deleteComment = async (commentId) => {
  const comment = await Comment.findById(commentId);
  if (!comment) throw new AppError("Comment not found", 404);

  await comment.deleteOne();
  return { message: "Comment deleted successfully" };
};

module.exports = { createComment, getCommentsByPost, deleteComment };