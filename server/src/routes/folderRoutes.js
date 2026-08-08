const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createNewFolder,
  getAllFolders,
  getFolderById,
  updateFolder,
  removeFolder,
} = require("../controllers/folderController");

// Create Folder
router.post("/", authMiddleware, createNewFolder);

// Get All Folders
router.get("/", authMiddleware, getAllFolders);

// Get Single Folder
router.get("/:id", authMiddleware, getFolderById);

// Rename Folder
router.patch("/:id", authMiddleware, updateFolder);

// Delete Folder
router.delete("/:id", authMiddleware, removeFolder);

module.exports = router;