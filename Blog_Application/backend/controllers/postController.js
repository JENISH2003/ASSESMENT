const postService = require("../services/postService");

// Create a new post
const createPost = async (req, res, next) => {
  try {
    const { title, content, tags } = req.body;
    const author = req.user._id; // from authMiddleware
    const imageUrl = req.file ? req.file.path : "";

    const post = await postService.createPost({ title, content, author, tags, imageUrl });

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

// Get all posts (Paginated & Filtered)
const getAllPosts = async (req, res, next) => {
  try {
    const { author, page, limit, search, tag } = req.query;
    
    // Convert logic appropriately
    const parsedPage = parseInt(page) || 1;
    const parsedLimit = parseInt(limit) || 20;

    const { posts, totalDocuments } = await postService.getAllPosts({
      authorId: author,
      page: parsedPage,
      limit: parsedLimit,
      search,
      tag
    });

    const totalPages = Math.ceil(totalDocuments / parsedLimit);

    // Map each post to clean object
    const cleanPosts = posts.map(post => ({
      _id: post._id,
      title: post.title,
      content: post.content,
      author: post.author, // populated already in service
      tags: post.tags,
      views: post.views || 0,
      imageUrl: post.imageUrl,
      isPublished: post.isPublished,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }));

    res.status(200).json({
      success: true,
      data: cleanPosts,
      meta: {
        totalDocuments,
        totalPages,
        currentPage: parsedPage,
        limit: parsedLimit,
        hasNextPage: parsedPage < totalPages,
        hasPrevPage: parsedPage > 1
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get post by ID
const getPostById = async (req, res, next) => {
  try {
    const post = await postService.getPostById(req.params.id);

    const cleanPost = {
      _id: post._id,
      title: post.title,
      content: post.content,
      author: post.author,
      tags: post.tags,
      views: post.views || 0,
      imageUrl: post.imageUrl,
      isPublished: post.isPublished,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };

    res.status(200).json({
      success: true,
      data: cleanPost,
    });
  } catch (error) {
    next(error);
  }
};

// Update post
const updatePost = async (req, res, next) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.imageUrl = req.file.path;
    }
    
    const post = await postService.updatePost(req.params.id, updateData, req.user);

    const cleanPost = {
      _id: post._id,
      title: post.title,
      content: post.content,
      author: post.author,
      tags: post.tags,
      imageUrl: post.imageUrl,
      isPublished: post.isPublished,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      data: cleanPost,
    });
  } catch (error) {
    next(error);
  }
};

// Delete post
const deletePost = async (req, res, next) => {
  try {
    const result = await postService.deletePost(req.params.id, req.user);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
};