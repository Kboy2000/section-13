const express = require("express"); // Imports Express for routing
const router = express.Router(); // Creates a new Express router instance

const {
  registerUser,
  loginUser,
  getMe,
} = require("../controllers/userController"); // Imports controller functions

const { protect } = require("../middleware/authMiddleware"); // Imports protect middleware
router.post("/register", registerUser); // Defines POST route for user registration
router.post("/login", loginUser); // Defines POST route for user login
router.get("/me", protect, getMe); // Defines GET route for current user, protected by middleware

module.exports = router; // Exports the router
