
import jwt from "jsonwebtoken";

// Middleware to protect routes using JWT authentication
const authMiddleware = (req, res, next) => {
  try {
    // Get the Authorization header from the request
    const authHeader = req.headers.authorization;

    // Check if the token exists and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Access denied. No token provided.",
      });
    }

    // Extract the actual token from "Bearer token"
    const token = authHeader.split(" ")[1];

    // Verify the token using our secret key from the .env file
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Store the logged-in user's ID in the request
    // Other routes can use req.userId to identify the user
    req.userId = decoded.userId;

    // Move to the next middleware or route handler
    next();

  } catch (error) {
    // Return an error if the token is invalid or expired
    return res.status(401).json({
      message: "Invalid or expired token.",
    });
  }
};

// Export the middleware so it can be used in protected routes
export default authMiddleware;
