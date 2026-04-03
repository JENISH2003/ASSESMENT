// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    const cookieToken = req.cookies?.token;
    const bearerToken = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null;
    const token = cookieToken || bearerToken;

    if (!token) {
      res.status(401);
      throw new Error("Not authorized, no token provided");
    }

    const jwtSecret = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET;
    if (!jwtSecret) {
      res.status(500);
      throw new Error("Server misconfiguration: JWT access secret missing");
    }
    const decoded = jwt.verify(token, jwtSecret);

    // Fetch user from database
    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(401);
      throw new Error("Not authorized, user does not exist");
    }

    // Attach user to request
    req.user = user;
    next(); // continue to route
  } catch (error) {
    next(error); // pass error to centralized error middleware
  }
};

module.exports = protect;