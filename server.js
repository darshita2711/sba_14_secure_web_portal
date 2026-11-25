// Load environment variables
import "dotenv/config";

import express from "express";
import connectDB from "./config/db.js";

import User from "./models/User.js";
// Create Express app
const app = express();


// Test route
app.get("/", (req, res) => {
  res.send("Secure Web Portal API is running!");
});

// Test User Model
app.get("/test-user", async (req, res) => {
  try {
    const testUser = await User.create({
      name: "Test User",
      email: "testuser@example.com",
      password: "temporary_test_password",
    });

    res.status(201).json({
      message: "User model is working!",
      user: testUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "User model test failed",
      error: error.message,
    });
  }
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();