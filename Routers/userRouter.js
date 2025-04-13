import express from "express"; // Importing Express framework
import { deleteUser, updateUser } from "../Controllers/userController.js"; // Importing user-related controller functions
import { middleware } from "../Middleware/MiddleWare.js"; // Importing authentication middleware

const router = express.Router(); // Creating a new router instance

// @route   PUT /api/user/update/:id
// @desc    Update user profile (username, email, password, profile picture)
// @access  Private (authenticated user only)
router.put("/update/:id", middleware, updateUser);

// @route   DELETE /api/user/delete/:id
// @desc    Delete user account
// @access  Private (authenticated user only)
router.delete("/delete/:id", middleware, deleteUser);

// Exporting the router to be used in the main app
export default router;
