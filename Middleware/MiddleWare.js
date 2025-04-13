import jwt from "jsonwebtoken"; // Library for working with JWT
import { errorHandler } from "../Utils/Error.js"; // Custom error utility
import dotenv from "dotenv"; // Load environment variables

dotenv.config(); // Initialize .env configuration

// Middleware to verify JWT token for protected routes
export const middleware = (req, res, next) => {
  // First, check standard Bearer token format
  const authHeader = req.headers.authorization;
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : req.headers.token; // fallback to custom 'token' header

  if (!token) {
    return next(errorHandler(401, "Unauthorized user - token missing"));
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return next(errorHandler(403, "Invalid or expired token"));
    }

    req.user = { id: user.id || user._id, isAdmin: user.isAdmin };
    next();
  });
};

