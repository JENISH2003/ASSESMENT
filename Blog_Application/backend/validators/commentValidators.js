const validateRequest = require("../middleware/validateRequest");

const createCommentValidator = validateRequest({
  content: { required: true, type: "string", minLength: 1 },
  postId: { required: true, type: "string", minLength: 10 },
});

module.exports = {
  createCommentValidator,
};
