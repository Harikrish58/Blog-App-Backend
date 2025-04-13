import express from "express"; // Import Express framework
import { middleware } from "../Middleware/MiddleWare.js"; // Import custom authentication middleware
import {
  createPost,
  getAllPosts,
  getPostById,
} from "../Controllers/postControllers.js"; // Import post-related controller functions

const router = express.Router(); // Initialize a new router

// @route   POST /api/post/createpost
// @desc    Create a new blog post (admin only)
// @access  Private (requires token + admin role)
router.post("/createpost", middleware, createPost);

// @route   GET /api/post/getallposts
// @desc    Get all blog posts (optionally filter by search query)
// @access  Private (requires token)
router.get("/getallposts", middleware, getAllPosts);

// @route   GET /api/post/getpost/:id
// @desc    Get a single blog post by its ID
// @access  Private (requires token)
router.get("/getpost/:id", middleware, getPostById);

// Export the router for use in the main server
export default router;
