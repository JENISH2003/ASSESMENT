// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    let token;
    
    // Step 1: Strictly read the token ONLY from the Authorization Header
    // It should look like: "Bearer asdf1234tokenstring..."
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      // Split "Bearer <token>" by the space and take the second part (the actual token)
      token = req.headers.authorization.split(" ")[1];
    }

    // Step 2: If no token was found in the header, block the request
    if (!token) {
      // 401 status means "Unauthorized"
      res.status(401);
      throw new Error("Not authorized, no token provided in the header");
    }

    // Step 3: Get our secret key securely from our environment variables
    const jwtSecret = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET;
    if (!jwtSecret) {
      res.status(500);
      throw new Error("Server misconfiguration: JWT access secret missing");
    }

    // Step 4: Verify the token is mathematically valid and not expired
    const decoded = jwt.verify(token, jwtSecret);

    // Step 5: Fetch user from database to make sure they haven't been deleted
    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(401);
      throw new Error("Not authorized, user does not exist");
    }

    // Step 6: Attach user to the request object so the controller can use it
    req.user = user;
    
    // Step 7: Continue to the next step (the controller)
    next(); 
    
  } catch (error) {
    next(error); // pass error to our centralized error-handling middleware
  }
};

module.exports = protect;