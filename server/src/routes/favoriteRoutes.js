const express = require("express");
const router = express.Router();

const {
  toggleFavorite,
  getFavoriteFiles,
} = require("../controllers/favoriteController");

const authMiddleware = require("../middleware/authMiddleware");

// Get all favorite files
router.get("/", authMiddleware, getFavoriteFiles);

// Add / Remove favorite
router.patch("/:id", authMiddleware, toggleFavorite);

module.exports = router;