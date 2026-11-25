// Load environment variables
import "dotenv/config";

import express from "express";
import connectDB from "./config/db.js";

// Create Express app
const app = express();


// Test route
app.get("/", (req, res) => {
  res.send("Secure Web Portal API is running!");
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