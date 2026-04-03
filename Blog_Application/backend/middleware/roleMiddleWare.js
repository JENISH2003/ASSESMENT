const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // Make sure user exists 
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Not authorized",
        });
      }

      // Check if user role is allowed
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Access denied. Insufficient permissions",
        });
      }

      // Role is allowed → continue
      next();

    } catch (error) {
      console.error("Role middleware error:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  };
};

module.exports = roleMiddleware;