const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { rateLimit, ipKeyGenerator } = require("express-rate-limit");


const userRoutes = require("./routes/userRoutes");
const fileRoutes = require("./routes/fileRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const trashRoutes = require("./routes/trashRoutes");
const folderRoutes = require("./routes/folderRoutes");

const app = express();

app.set("trust proxy", 1);

const allowedOrigins = (process.env.CLIENT_ORIGINS ||
  "https://cloud-drive-sage.vercel.app,http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Origin is not allowed by CORS."));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json({ limit: "50kb" }));

// Rate Limiter: Per-IP login failure protection (Layer 1)
const loginIpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  skipSuccessfulRequests: true,
  standardHeaders: false,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
});

// Rate Limiter: Per-Account login failure protection against distributed attacks (Layer 2)
const loginAccountLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  standardHeaders: false,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const email = req.body?.email;
    if (typeof email === "string" && email.trim()) {
      return `account:${email.trim().toLowerCase()}`;
    }
    return `ip:${ipKeyGenerator(req.ip || "127.0.0.1")}`;
  },
  validate: {
    xForwardedForHeader: false,
    default: true,
  },
  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
});

// Rate Limiter: Registration protection
const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: false,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many registration attempts. Please try again later.",
  },
});

// Test Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to CloudDrive API 🚀",
  });
});

// Health Check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CloudDrive API is running 🚀",
  });
});

// User Routes
app.use("/api/users/login", loginIpLimiter, loginAccountLimiter);
app.use("/api/users/register", registerLimiter);
app.use("/api/users", userRoutes);

// File Routes
app.use("/api/files", fileRoutes);

// Dashboard Routes
app.use("/api/dashboard", dashboardRoutes);




// Favorite Routes
app.use("/api/favorites", favoriteRoutes);

// Trash Routes
app.use("/api/trash", trashRoutes);

// Folder Routes
app.use("/api/folders", folderRoutes);

// Unmatched API routes fallback
app.all(/^\/api(\/.*)?$/, (req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found.",
  });
});

app.use((error, req, res, next) => {
  if (error) {
    if (error.type === "entity.too.large" || error.status === 413) {
      return res.status(413).json({
        success: false,
        message: "Request payload too large.",
      });
    }

    // Sanitize Mongoose casting errors to prevent leaking internal field names / model names
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid resource identifier.",
      });
    }

    // Sanitize MongoDB duplicate key collisions
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Resource already exists.",
      });
    }

    // Sanitize Mongoose validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error.",
      });
    }

    if (error.name === "MulterError") {
      return res.status(400).json({
        success: false,
        message: error.message || "Invalid request.",
      });
    }

    if (
      typeof error.status === "number" &&
      error.status >= 400 &&
      error.status < 500
    ) {
      return res.status(error.status).json({
        success: false,
        message: error.message || "Invalid request.",
      });
    }

    console.error("Unhandled application error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }

  return next();
});

module.exports = app;
