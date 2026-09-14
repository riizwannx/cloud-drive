const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  // Enforce strict no-store cache policy for all authenticated / private responses
  res.setHeader(
    "Cache-Control",
    "private, no-cache, no-store, must-revalidate"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  try {
    // Get Authorization header
    const authHeader = req.headers.authorization;

    // Check if Authorization header exists
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // Check Bearer token format
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Invalid token format.",
      });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    if (!token || typeof token !== "string" || !token.trim()) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token.",
      });
    }

    // Ensure JWT_SECRET is configured
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET environment variable is missing.");
      return res.status(500).json({
        success: false,
        message: "Server authentication configuration error.",
      });
    }

    // Cryptographically verify token, pin algorithm strictly to HS256, and verify expiration
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });

    // Validate decoded payload identity structure
    if (
      !decoded ||
      typeof decoded !== "object" ||
      typeof decoded.id !== "string" ||
      !mongoose.Types.ObjectId.isValid(decoded.id) ||
      !/^[0-9a-fA-F]{24}$/.test(decoded.id)
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token.",
      });
    }

    // Verify token version against current user record for revocation
    const user = await User.findById(decoded.id).select("tokenVersion").lean();

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token.",
      });
    }

    const currentTokenVersion = user.tokenVersion || 0;
    const tokenVersion =
      typeof decoded.tokenVersion === "number" ? decoded.tokenVersion : 0;

    if (currentTokenVersion !== tokenVersion) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token.",
      });
    }

    // Save decoded data in request (attach validated user identity)
    req.user = decoded;

    // Continue to next middleware/controller
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

module.exports = authMiddleware;
