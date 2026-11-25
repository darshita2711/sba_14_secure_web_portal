import mongoose from "mongoose";

// Define Bookmark Schema
const bookmarkSchema = new mongoose.Schema(
  {
    // Bookmark title
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Bookmark URL
    url: {
      type: String,
      required: true,
      trim: true,
    },

    // Optional description
    description: {
      type: String,
      default: "",
      trim: true,
    },

    // User who owns this bookmark
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create Bookmark model
const Bookmark = mongoose.model("Bookmark", bookmarkSchema);

export default Bookmark;