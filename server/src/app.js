const express = require("express");
const cors = require("cors");
const path = require("path");

const userRoutes = require("./routes/userRoutes");
const fileRoutes = require("./routes/fileRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const trashRoutes = require("./routes/trashRoutes");
const folderRoutes = require("./routes/folderRoutes");
const shareRoutes = require("./routes/shareRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

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

// Trash Routes
app.use("/api/trash", trashRoutes);

// Folder Routes
app.use("/api/folders", folderRoutes);

// Share Routes
app.use("/api/share", shareRoutes);

module.exports = app;