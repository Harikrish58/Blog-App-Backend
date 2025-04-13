import User from "../Models/userModel.js"; // Importing the User model to interact with the database
import { errorHandler } from "../Utils/Error.js"; // Custom error handler utility
import bcryptjs from "bcryptjs"; // Importing bcryptjs for hashing passwords
import jwt from "jsonwebtoken"; // Importing jwt for generating tokens
import dotenv from "dotenv"; // Importing dotenv for managing environment variables
import validator from "validator"; // Importing validator for validating email format

dotenv.config(); // Loading environment variables from the .env file

// Register new user
export const registerUser = async (req, res, next) => {
  const { username, email, password } = req.body;

  // Validate that all fields are provided and email is valid
  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    return next(errorHandler(400, "All fields are required"));
  }

  if (!validator.isEmail(email)) {
    return next(errorHandler(400, "Invalid email format")); // Validate email format
  }

  // Hash password asynchronously for better performance
  const hashedPassword = await bcryptjs.hash(password, 10);

  // Create new user and save to database
  const newUser = new User({ username, email, password: hashedPassword });

  try {
    await newUser.save();
    res
      .status(201)
      .json({ message: "User registered successfully", result: newUser });
  } catch (error) {
    next(error); // Pass errors to error handling middleware
  }
};

// User sign-in function
export const signinUser = async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email and password
  if (!email || !password || email === "" || password === "") {
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    const userDetail = await User.findOne({ email }).select("+password"); // Find user by email and include password field
    if (!userDetail) {
      return next(errorHandler(404, "User not found")); // Handle user not found
    }

    const isPasswordValid = await bcryptjs.compare(
      password,
      userDetail.password
    ); // Compare provided password with the stored hash
    if (!isPasswordValid) {
      return next(errorHandler(401, "Invalid credentials")); // Handle invalid credentials
    }

    // Generate JWT token with user details and expiration time
    const token = jwt.sign(
      { id: userDetail._id, isAdmin: userDetail.isAdmin },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    // Return user details excluding password and send JWT token
    const { password: _, ...user } = userDetail._doc;
    res.status(200).json({
      message: "User logged in successfully",
      result: user,
      token,
    });
  } catch (error) {
    next(error); // Pass errors to error handling middleware
  }
};

// Google Authentication
export const googleAuth = async (req, res, next) => {
  const { email, name, picture } = req.body;

  try {
    // Check if user already exists with the given email
    const userDetail = await User.findOne({ email });
    if (userDetail) {
      // If user exists, generate a token and respond
      const token = jwt.sign(
        { id: userDetail._id, isAdmin: userDetail.isAdmin },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1d" }
      );
      const { password: _, ...user } = userDetail._doc;
      res.status(200).json({
        message: "User logged in successfully",
        result: user,
        token,
      });
    } else {
      // If the user doesn't exist, create a new user
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8); // Generate random password for new users
      const hashedPassword = await bcryptjs.hash(generatedPassword, 10); // Hash the generated password

      const newUser = new User({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4), // Generate username
        email,
        password: hashedPassword,
        profilePicture: picture,
      });

      await newUser.save(); // Save the new user to the database

      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1d" }
      );

      // Return the user details and token
      const { password: _, ...user } = newUser._doc;
      res.status(201).json({
        message: "User registered successfully",
        result: user,
        token,
      });
    }
  } catch (error) {
    next(error); // Pass errors to error handling middleware
  }
};
