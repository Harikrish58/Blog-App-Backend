// Importing required packages
import mongoose from "mongoose"; // For connecting to MongoDB
import dotenv from "dotenv"; // For loading environment variables

// Load environment variables from .env file into process.env
dotenv.config();

// MongoDB connection string retrieved from environment variable
const mongodb_URL = process.env.MONGODB_URL;

// Function to connect to MongoDB using mongoose
export const connectDB = async (req, res) => {
  try {
    // Attempt to connect to the MongoDB database
    const connection = await mongoose.connect(mongodb_URL);

    // If successful, log to the console
    console.log("MongoDB connected successfully");

    // Return the connection object (optional, in case needed)
    return connection;
  } catch (error) {
    // If connection fails, log the error and respond with 500 status
    console.log(error);
    res.status(500).json({ message: "MongoDB connection error" });
  }
};
