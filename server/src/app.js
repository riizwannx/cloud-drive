const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Welcome to CloudDrive API 🚀"
    });
});

// Health Check
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "CloudDrive API is running 🚀"
    });
});

// User Routes
app.use("/api/users", userRoutes);

module.exports = app;