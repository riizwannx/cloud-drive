const express = require("express");
const cors = require("cors");

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
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "CloudDrive API is running 🚀"
    });
});

module.exports = app;