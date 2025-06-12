const asyncHandler = require("express-async-handler"); // Imports asyncHandler to handle async errors
const bcrypt = require("bcryptjs"); // Imports bcrypt for password hashing (used in model, included for clarity)
const jwt = require("jsonwebtoken"); // Imports jsonwebtoken for JWT creation
const User = require("../models/userModel"); // Imports the User model

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body; // Destructures name, email, password from request body
  if (!name || !email || !password) {
    // Checks if all required fields are provided
    res.status(400); // Sets response status to 400 (Bad Request)
    throw new Error("Please include all fields"); // Throws an error with a message
  }
  // Check if user exists
  const userExists = await User.findOne({ email }); // Searches for a user with the provided email
  if (userExists) {
    // Checks if a user was found
    res.status(400); // Sets response status to 400
    throw new Error("User already exists"); // Throws an error
  }

  // Create user
  const user = await User.create({ name, email, password }); // Creates a new user with provided data
  if (user) {
    // Checks if user creation was successful
    res.status(201).json({
      _id: user._id, // Includes user ID
      name: user.name, // Includes user name
      email: user.email, // Includes user email
      token: generateToken(user._id), // Includes JWT token
    });
  } else {
    res.status(400); // Sets response status to 400
    throw new Error("Invalid user data"); // Throws an error
  }
});

// @desc    Login a user
// @route   POST /api/users/login
// @access  Public

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body; // Destructures email and password from request body
  const user = await User.findOne({ email }); // Finds a user by email
  if (user && (await user.matchPassword(password))) {
    // Checks if user exists and password matches
    res.json({
      // Sends a JSON response with user data
      _id: user._id, // Includes user ID
      name: user.name, // Includes user name
      email: user.email, // Includes user email
      token: generateToken(user._id), // Includes JWT token
    });
  } else {
    // Handles invalid credentials
    res.status(401); // Sets response status to 401 (Unauthorized)
    throw new Error("Invalid email or password"); // Throws an error
  }
});

// @desc    Get current user
// @route   GET /api/users/me
// @access  Private

const getMe = asyncHandler(async (req, res) => {
  // Defines async function to get current user
  res.status(200).json(req.user); // Sends a 200 (OK) response with user data from middleware
});

// Generate JWT
const generateToken = (id) => {
  // Defines function to generate a JWT
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    // Signs a token with user ID payload
    expiresIn: "30d", // Sets token expiration to 30 days
  });
};

module.exports = {
  // Exports controller functions
  registerUser, // Exports registerUser function
  loginUser, // Exports loginUser function
  getMe, // Exports getMe function
};
