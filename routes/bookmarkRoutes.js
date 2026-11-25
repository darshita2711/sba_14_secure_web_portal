
import express from "express";
import Bookmark from "../models/Bookmark.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Protect all bookmark routes with JWT authentication
router.use(authMiddleware);

// ========================================
// CREATE A BOOKMARK
// POST /api/bookmarks
// ========================================
router.post("/", async (req, res) => {
  try {
    // Get bookmark details from the request body
    const { title, url, description } = req.body;

    // Check required fields
    if (!title || !url) {
      return res.status(400).json({
        message: "Title and URL are required.",
      });
    }

    // Create a bookmark and associate it with the logged-in user
    const bookmark = await Bookmark.create({
      title,
      url,
      description,
      user: req.userId,
    });

    // Return the newly created bookmark
    res.status(201).json({
      message: "Bookmark created successfully.",
      bookmark,
    });

  } catch (error) {
    console.error("Create bookmark error:", error);

    res.status(500).json({
      message: "Server error while creating bookmark.",
    });
  }
});
// ========================================
// GET ALL BOOKMARKS FOR LOGGED-IN USER
// GET /api/bookmarks
// ========================================
router.get("/", async (req, res) => {
  try {
    // Find only bookmarks belonging to the logged-in user
    const bookmarks = await Bookmark.find({
      user: req.userId,
    });

    res.status(200).json({
      count: bookmarks.length,
      bookmarks,
    });

  } catch (error) {
    console.error("Get bookmarks error:", error);

    res.status(500).json({
      message: "Server error while fetching bookmarks.",
    });
  }
});

// ========================================
// GET ONE BOOKMARK
// GET /api/bookmarks/:id
// ========================================
router.get("/:id", async (req, res) => {
  try {
    // Check whether the provided ID is valid
    if (!Bookmark.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid bookmark ID.",
      });
    }

    // Find the bookmark using its ID and logged-in user's ID
    const bookmark = await Bookmark.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    // Check whether the bookmark exists and belongs to this user
    if (!bookmark) {
      return res.status(404).json({
        message: "Bookmark not found.",
      });
    }

    res.status(200).json({ bookmark });

  } catch (error) {
    console.error("Get bookmark error:", error);

    res.status(500).json({
      message: "Server error while fetching bookmark.",
    });
  }
});

// ========================================
// UPDATE A BOOKMARK
// PUT /api/bookmarks/:id
// ========================================
router.put("/:id", async (req, res) => {
  try {
    // Validate the bookmark ID
    if (!Bookmark.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid bookmark ID.",
      });
    }

    // Allow only these fields to be updated
    const { title, url, description } = req.body;
    const updates = {};

    if (title !== undefined) updates.title = title;
    if (url !== undefined) updates.url = url;
    if (description !== undefined) updates.description = description;

    // Prevent empty update requests
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "Please provide at least one field to update.",
      });
    }

    // Update only if the bookmark belongs to the logged-in user
    const updatedBookmark = await Bookmark.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.userId,
      },
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    );

    // Check whether the bookmark exists
    if (!updatedBookmark) {
      return res.status(404).json({
        message: "Bookmark not found.",
      });
    }

    res.status(200).json({
      message: "Bookmark updated successfully.",
      bookmark: updatedBookmark,
    });

  } catch (error) {
    console.error("Update bookmark error:", error);

    res.status(500).json({
      message: "Server error while updating bookmark.",
    });
  }
});

// ========================================
// DELETE A BOOKMARK
// DELETE /api/bookmarks/:id
// ========================================
router.delete("/:id", async (req, res) => {
  try {
    // Validate the bookmark ID
    if (!Bookmark.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid bookmark ID.",
      });
    }

    // Delete only if the bookmark belongs to the logged-in user
    const deletedBookmark = await Bookmark.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    // Check whether the bookmark exists
    if (!deletedBookmark) {
      return res.status(404).json({
        message: "Bookmark not found.",
      });
    }

    res.status(200).json({
      message: "Bookmark deleted successfully.",
    });

  } catch (error) {
    console.error("Delete bookmark error:", error);

    res.status(500).json({
      message: "Server error while deleting bookmark.",
    });
  }
});

export default router;
