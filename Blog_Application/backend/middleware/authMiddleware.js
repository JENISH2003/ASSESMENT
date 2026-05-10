// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      res.status(401);
      throw new Error("Not authorized, no token provided in the header");
    }

    const jwtSecret = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET;
    if (!jwtSecret) {
      res.status(500);
      throw new Error("Server misconfiguration: JWT access secret missing");
    }

    let decoded;
    try {
      decoded = jwt.verify(token, jwtSecret);
    } catch (error) {
      res.status(401);
      throw new Error(
        error.name === "TokenExpiredError"
          ? "Not authorized, token expired"
          : "Not authorized, token failed"
      );
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(401);
      throw new Error("Not authorized, user does not exist");
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = protect;
