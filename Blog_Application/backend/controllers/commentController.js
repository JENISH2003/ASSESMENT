const commentService = require("../services/commentService");

// Create comment
const createComment = async (req, res, next) => {
  try {
    const author = req.user._id;
    const { content, postId } = req.body;

    const comment = await commentService.createComment({ content, author, postId });

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

// Get comments for a post
const getCommentsByPost = async (req, res, next) => {
  try {
    const comments = await commentService.getCommentsByPost(req.params.postId);
    res.status(200).json({ success: true, data: comments });
  } catch (error) {
    next(error);
  }
};

// Delete comment
const deleteComment = async (req, res, next) => {
  try {
    const result = await commentService.deleteComment(req.params.commentId);
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    next(error);
  }
};

module.exports = { createComment, getCommentsByPost, deleteComment };