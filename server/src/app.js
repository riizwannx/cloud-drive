const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");


const userRoutes = require("./routes/userRoutes");
const fileRoutes = require("./routes/fileRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const trashRoutes = require("./routes/trashRoutes");
const folderRoutes = require("./routes/folderRoutes");

const app = express();

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
app.use(express.json());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many attempts. Please try again later." },
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
app.use("/api/users/login", authLimiter);
app.use("/api/users/register", authLimiter);
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

app.use((error, req, res, next) => {
  if (error) {
    const status = error.name === "MulterError" ? 400 : 400;
    return res.status(status).json({
      success: false,
      message: error.message || "Invalid request.",
    });
  }

  return next();
});

module.exports = app;
