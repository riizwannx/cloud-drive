const express = require("express");
const router = express.Router();

const { getDashboard } = require("../controllers/dashboardController");
const authMiddleware = require("../middleware/authMiddleware");

// Get Dashboard
router.get("/", authMiddleware, getDashboard);

module.exports = router;