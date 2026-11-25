import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import generateToken from "../utils/auth.js";

const router = express.Router();

// ========================================
// USER REGISTRATION
// POST /api/users/register
// ========================================
router.post("/register", async (req, res) => {
  try {
    // Get user details from the request body
    const { name, email, password } = req.body;

    // Check that all required fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please provide name, email, and password.",
      });
    }

    // Convert email to lowercase and remove extra spaces
    const normalizedEmail = email.trim().toLowerCase();

    // Check whether the email is already registered
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email is already registered.",
      });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in MongoDB
    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    // Generate a JWT token for the newly registered user
    const token = generateToken(newUser._id);

    // Send the token and safe user details back to the client
    return res.status(201).json({
      message: "User registered successfully.",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });

  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      message: "Server error during registration.",
    });
  }
});
// Export the router so server.js can use these routes
export default router;