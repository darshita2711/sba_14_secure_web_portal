
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

export default router;
