import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import generateToken from "../utils/auth.js";
import passport from "../config/passport.js";

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

// ========================================
// USER LOGIN
// POST /api/users/login
// ========================================
router.post("/login", async (req, res) => {
  try {
    // Get email and password from the request body
    const { email, password } = req.body;

    // Check that both fields are provided
    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password.",
      });
    }

    // Find the user by email
    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    // Check whether the user exists
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // Check whether this account has a local password
    // GitHub-only accounts may not have a password
    if (!user.password) {
      return res.status(401).json({
        message: "Please log in using GitHub.",
      });
    }

    // Compare the entered password with the hashed password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    // Reject login if the password does not match
    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // Generate a JWT token after successful login
    const token = generateToken(user._id);

    // Return the token and safe user details
    return res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Server error during login.",
    });
  }
});


// ========================================
// GITHUB OAUTH LOGIN
// GET /api/users/auth/github
// ========================================
router.get(
  "/auth/github",
  passport.authenticate("github", {
    scope: ["user:email"],
    session: false,
  })
);

// ========================================
// GITHUB OAUTH CALLBACK
// GET /api/users/auth/github/callback
// ========================================
router.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: "/",
  }),
  (req, res) => {
    try {
      // Get the authenticated user from Passport
      const user = req.user;

      // Generate a JWT token for the GitHub user
      const token = generateToken(user._id);

      // Return the token and safe user information
      res.status(200).json({
        message: "GitHub login successful.",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });

    } catch (error) {
      console.error("GitHub login error:", error);

      res.status(500).json({
        message: "GitHub authentication failed.",
      });
    }
  }
);
// Export the router so server.js can use these routes
export default router;