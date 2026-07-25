const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  moveFileToTrash,
  getTrash,
  restoreTrashFile,
  deleteTrashFile,
} = require("../controllers/trashController");

// Get all trashed files
router.get("/", authMiddleware, getTrash);

// Move file to Trash
router.patch("/:id", authMiddleware, moveFileToTrash);

// Restore file from Trash
router.patch("/restore/:id", authMiddleware, restoreTrashFile);

// Permanently delete file
router.delete("/:id", authMiddleware, deleteTrashFile);

module.exports = router;