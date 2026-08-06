const express = require("express");
const router = express.Router();

const {
  uploadFile,
  getMyFiles,
  getFilesByFolder,
  downloadFile,
  deleteFile,
  renameFile,
  searchFiles,
  toggleFavorite,
  getFavoriteFiles,
} = require("../controllers/fileController");

const upload = require("../middleware/uploadMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

// ==============================
// Upload File
// ==============================
router.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  uploadFile
);

// ==============================
// Get My Files
// ==============================
router.get("/", authMiddleware, getMyFiles);

// ==============================
// Get Files By Folder
// ==============================
router.get(
  "/folder/:folderId",
  authMiddleware,
  getFilesByFolder
);

// ==============================
// Get Favorite Files
// ==============================
router.get(
  "/favorites",
  authMiddleware,
  getFavoriteFiles
);

// ==============================
// Search Files
// ==============================
router.get(
  "/search",
  authMiddleware,
  searchFiles
);

// ==============================
// Download File
// ==============================
router.get(
  "/download/:id",
  authMiddleware,
  downloadFile
);

// ==============================
// Rename File
// ==============================
router.put(
  "/:id",
  authMiddleware,
  renameFile
);

// ==============================
// Toggle Favorite
// ==============================
router.patch(
  "/favorite/:id",
  authMiddleware,
  toggleFavorite
);

// ==============================
// Delete File
// ==============================
router.delete(
  "/:id",
  authMiddleware,
  deleteFile
);

module.exports = router;