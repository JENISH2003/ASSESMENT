const validateRequest = require("../middleware/validateRequest");

const createPostValidator = validateRequest({
  title: { required: true, type: "string", minLength: 3 },
  content: { required: true, type: "string", minLength: 5 },
  tags: { required: false, type: "array" },
});

const updatePostValidator = validateRequest({
  title: { required: false, type: "string", minLength: 3 },
  content: { required: false, type: "string", minLength: 5 },
  tags: { required: false, type: "array" },
  isPublished: { required: false },
});

module.exports = {
  createPostValidator,
  updatePostValidator,
};
