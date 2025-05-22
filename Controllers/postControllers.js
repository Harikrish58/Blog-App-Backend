import Post from "../Models/postModel.js"; // Importing the Post model to interact with the posts in the database
import { errorHandler } from "../Utils/Error.js"; // Importing the custom error handler for consistent error responses

// Controller to handle creating a new post
export const createPost = async (req, res, next) => {
  // Check if the user is an admin; if not, return a 403 error (Forbidden)
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to create a post"));
  }

  // Ensure that both title and content are provided in the request body
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, "All fields are required"));
  }

  // Destructuring to extract the title, content, image, and category from the request body
  const { title, content, image, category } = req.body;

  // Creating a new post object
  const newPost = new Post({
    title,
    content,
    image,
    category,
  });

  try {
    // Saving the new post to the database
    const savedPost = await newPost.save();

    // Sending a success response with the saved post
    res.status(200).json({
      message: "Post created successfully",
      result: savedPost,
    });
  } catch (error) {
    // If an error occurs, pass it to the error handler
    next(error);
  }
};

// Controller to handle fetching all posts (with optional search functionality)
export const getAllPosts = async (req, res, next) => {
  try {
    // Check if there's a search query in the request
    const search = req.query.search || ""; // Default to empty string if no search query

    let posts;
    // If there's a search term, find posts matching the term in the title, content, or category
    if (search) {
      posts = await Post.find({
        $or: [
          { title: { $regex: search, $options: "i" } }, // Case-insensitive search on title
          { content: { $regex: search, $options: "i" } }, // Case-insensitive search on content
          { category: { $regex: search, $options: "i" } }, // Case-insensitive search on category
        ],
      }).sort({ createdAt: -1 }); // Sort posts by creation date, descending
    } else {
      // If no search term, just fetch all posts sorted by creation date
      posts = await Post.find().sort({ createdAt: -1 });
    }

    // Sending a success response with the list of posts
    res.status(200).json({
      message: "Posts fetched successfully",
      result: posts,
    });
  } catch (error) {
    // If an error occurs, pass it to the error handler
    next(error);
  }
};

// Controller to handle fetching a post by its ID
export const getPostById = async (req, res, next) => {
  try {
    // Finding the post by its ID from the request parameters
    const post = await Post.findById(req.params.id);

    // If the post is not found, return a 404 error
    if (!post) {
      return next(errorHandler(404, "Post not found"));
    }

    // Sending a success response with the found post
    res.status(200).json({
      message: "Post fetched successfully",
      result: post,
    });
  } catch (error) {
    // If an error occurs, pass it to the error handler
    next(error);
  }
};

// Controller to delete a post by its ID
export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });

    // Check if the user is an admin; if not, return a 403 error (Forbidden)
    if (!req.user.isAdmin) {
      return next(errorHandler(403, "Only admins can delete posts"));
    }

    await post.deleteOne();
    res
      .status(200)
      .json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    next(error);
  }
};
