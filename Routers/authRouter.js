import express from "express"; // Import Express to create routes
import {
  googleAuth,
  registerUser,
  signinUser,
} from "../Controllers/authControllers.js"; // Import authentication controller functions

const router = express.Router(); // Create a new router instance

// @route   POST /api/auth/register-user
// @desc    Registers a new user
// @access  Public
router.post("/register-user", registerUser);

// @route   POST /api/auth/signin-user
// @desc    Authenticates an existing user and returns a token
// @access  Public
router.post("/signin-user", signinUser);

// @route   POST /api/auth/googleauth
// @desc    Authenticates or registers a user via Google OAuth
// @access  Public
router.post("/googleauth", googleAuth);

// Export the router to be used in your main server file
export default router;
