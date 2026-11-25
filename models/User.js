import mongoose from "mongoose";

// Define User Schema
const userSchema = new mongoose.Schema(
  {
    // User's name
    name: {
      type: String,
      trim: true,
    },

    // User's email
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Hashed password (for local authentication)
    password: {
      type: String,
      required: false,
    },

    // GitHub ID (for OAuth authentication)
    githubId: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create User model
const User = mongoose.model("User", userSchema);

export default User;