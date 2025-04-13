import mongoose from "mongoose";

// Define the schema for users
const userSchema = new mongoose.Schema(
  {
    // Username field with validation and uniqueness
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,                                       // Ensures no duplicates
      trim: true,                                         // Removes whitespace
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [50, "Username cannot exceed 50 characters"],
    },

    // Email field with validation and format check
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,                                       // Ensures email is unique
      trim: true,
      lowercase: true,                                    // Normalizes the email
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"], // Basic regex for email validation
    },

    // Password field with minimum length and hidden by default
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false,                                      // Excludes password from default query results
    },

    // Optional profile picture
    profilePicture: {
      type: String,
      default: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541",
    },

    // Admin role flag
    isAdmin: {
      type: Boolean,
      default: false,                                     // By default, users are not admins
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

// Exporting the User model
const User = mongoose.model("User", userSchema);
export default User;
