const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const fileRoutes = require("./routes/fileRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

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
app.use("/api/users", userRoutes);

// File Routes
app.use("/api/files", fileRoutes);

// Dashboard Routes
app.use("/api/dashboard", dashboardRoutes);

// Favorite Routes
app.use("/api/favorites", favoriteRoutes);

module.exports = app;