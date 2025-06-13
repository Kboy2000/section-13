const jwt = require("jsonwebtoken"); // Imports jsonwebtoken for token verification
const asyncHandler = require("express-async-handler"); // Imports asyncHandler for error handling
const User = require("../models/userModel"); // Imports the User model

const protect = asyncHandler(async (req, res, next) => {
  // Defines async middleware to protect routes
  let token; // Declares variable to store the token
  if (
    // Checks if Authorization header exists and starts with 'Bearer'
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Starts a try block to handle token verification
      // Get token from header
      token = req.headers.authorization.split(" ")[1]; // Extracts token from 'Bearer <token>'

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifies token using secret key

      // Get user from token
      req.user = await User.findById(decoded.id).select("-password"); // Finds user by ID, excludes password

      if (!req.user) {
        // Checks if user exists
        res.status(401); // Sets response status to 401
        throw new Error("Not authorized, user not found"); // Throws an error
      }
      next(); // Calls the next middleware or route handler
    } catch (error) {
      // Catches token verification errors
      res.status(401); // Sets response status to 401
      throw new Error("Not authorized, token failed"); // Throws an error
    }
  } else {
    // If no token is provided
    // Handles missing token
    res.status(401); // Sets response status to 401
    throw new Error("Not authorized, no token"); // Throws an error
  }
});

module.exports = { protect }; // Exports the protect middleware
