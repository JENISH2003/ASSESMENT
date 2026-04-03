const checkBlocked = (req, res, next) => {
  if (req.user && req.user.isBlocked) {
    return res.status(403).json({
      success: false,
      message: "Your account is blocked. You cannot perform this action.",
    });
  }
  next();
};

module.exports = checkBlocked;
