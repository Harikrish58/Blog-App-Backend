import jwt from "jsonwebtoken"; // Import JSON Web Token library
import { errorHandler } from "../Utils/Error.js"; // Custom error handler utility
import dotenv from "dotenv"; // For loading environment variables

dotenv.config(); // Load environment variables from .env

// Middleware function to verify JWT token and protect private routes
export const middleware = (req, res, next) => {
  // Try to extract token from 'Authorization' header (Bearer <token>) OR fallback to custom 'token' header
  const authHeader = req.headers.authorization;
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : req.headers.token;

  // If token is missing in both headers, deny access
  if (!token) {
    return next(errorHandler(401, "Unauthorized user - token missing"));
  }

  // Verify the token using the secret key
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return next(errorHandler(403, "Invalid or expired token")); // Forbidden
    }

    // Attach the decoded user data to request for later use (e.g., req.user.id, req.user.isAdmin)
    req.user = user;
    next(); // Continue to the next middleware or route handler
  });
};
