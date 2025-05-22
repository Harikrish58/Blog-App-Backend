import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./Database/config.js";
import authRoute from "./Routers/authRouter.js";
import userRoute from "./Routers/userRouter.js";
import cookieParser from "cookie-parser";
import postRoute from "./Routers/postRouter.js";

dotenv.config(); // Load environment variables from .env file

const app = express();

// Middleware to handle cross-origin requests
app.use(
  cors({
    origin: ["https://devhub-blogapp.netlify.app","http://localhost:5173"], // Allowed origins
    credentials: true,    // Allow cookies and credentials
  })
);

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to parse cookies from incoming requests
app.use(cookieParser());

// Global error handler (should be after all route handlers)
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Connect to MongoDB
connectDB();

// Test route
app.get("/", (req, res) => {
  res.status(200).send("Welcome to the API");
});

// Route middlewares
app.use("/api/auth", authRoute);    // Routes for registration, login, Google auth
app.use("/api/user", userRoute);    // Routes for user update, delete
app.use("/api/post", postRoute);    // Routes for blog post creation and retrieval

// Start the server
app.listen(process.env.PORT, () => {
  console.log("Server running on the PORT");
});
