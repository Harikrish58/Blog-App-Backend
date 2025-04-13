import { errorHandler } from "../Utils/Error.js"; // Importing custom error handler
import User from "../Models/userModel.js"; // Importing the User model to interact with the database
import bcryptjs from "bcryptjs"; // Importing bcryptjs for password hashing

// Controller to handle updating a user profile
export const updateUser = async (req, res, next) => {
  console.log("🔍 req.params.id:", req.params.id);
  console.log("🔐 req.user.id:", req.user.id);
  // Check if the user is trying to update their own account
  if (req.params.id !== req.user.id) {
    return next(errorHandler(403, "You can only update your account!")); // Send a 403 Forbidden error if not
  }

  // Check if the password is provided in the update request
  if (req.body.password) {
    // Validate password length
    if (req.body.password.length < 6) {
      return next(
        errorHandler(400, "Password must be at least 6 characters long") // Send a 400 Bad Request error if password is too short
      );
    }

    // Hash the new password before saving it
    req.body.password = bcryptjs.hashSync(req.body.password, 10);

    // Validate the username if it is included in the update request
    if (req.body.username) {
      // Check for valid username length
      if (req.body.username.length < 3 || req.body.username.length > 20) {
        return next(
          errorHandler(400, "Username must be at least 3 characters long") // Send a 400 error if username length is invalid
        );
      }
      // Check if username contains spaces
      if (req.body.username.includes(" ")) {
        return next(errorHandler(400, "Username must not contain spaces")); // Send error if username contains spaces
      }
      // Check if username is lowercase
      if (req.body.username !== req.body.username.toLowerCase()) {
        return next(errorHandler(400, "Username must be in lowercase")); // Send error if username is not lowercase
      }
      // Ensure username contains only alphanumeric characters
      if (!req.body.username.match(/^[A-Za-z0-9]+$/)) {
        return next(
          errorHandler(400, "Username must not contain special characters") // Send error if username contains special characters
        );
      }
    }
  }

  try {
    // Update the user details in the database
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username, // Update username if provided
          email: req.body.email, // Update email if provided
          password: req.body.password, // Update password if provided
          profilePicture: req.body.profilePicture, // Update profile picture if provided
        },
      },
      { new: true } // Ensure the updated user document is returned
    );

    // Exclude the password field from the response
    const { password: _, ...user } = updatedUser._doc;

    // Send success response with updated user details (excluding password)
    res.status(200).json({
      message: "User updated successfully", // Success message
      result: user, // Updated user details (without password)
    });
  } catch (error) {
    // Handle any errors during the update operation
    next(error);
  }
};

// Controller to handle deleting a user profile
export const deleteUser = async (req, res, next) => {
  // Check if the user is trying to delete their own account
  if (req.params.id !== req.user.id) {
    return next(errorHandler(403, "You can only delete your account!")); // Send a 403 Forbidden error if not
  }

  try {
    // Delete the user from the database by ID
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully" }); // Send success response
  } catch (error) {
    // Handle any errors during the delete operation
    next(error);
  }
};
