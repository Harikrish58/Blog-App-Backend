import jwt from "jsonwebtoken"; // Library for working with JWT
import { errorHandler } from "../Utils/Error.js"; // Custom error utility
import dotenv from "dotenv"; // Load environment variables

dotenv.config(); // Initialize .env configuration

// Middleware to verify JWT token for protected routes
export const middleware = (req, res, next) => {
  // 🔍 Get the token from custom 'token' header (used in your frontend)
  const token = req.headers.token;

  // If token is missing, block access
  if (!token) {
    return next(errorHandler(401, "Unauthorized user - token missing"));
  }

  // If token is found, verify it
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    // If token is invalid or expired
    if (err) {
      return next(errorHandler(403, "Invalid or expired token"));
    }

    // Attach decoded user info (id, isAdmin) to the request
    req.user = user;
    next(); // Proceed to the next middleware/controller
  });
};
