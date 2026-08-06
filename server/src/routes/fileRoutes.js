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
  getTrashFiles,
  restoreFile,
  permanentlyDeleteFile,
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
// Get Trash Files
// ==============================
router.get(
  "/trash",
  authMiddleware,
  getTrashFiles
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
// Restore File
// ==============================
router.patch(
  "/restore/:id",
  authMiddleware,
  restoreFile
);

// ==============================
// Move File to Trash
// ==============================
router.delete(
  "/:id",
  authMiddleware,
  deleteFile
);

// ==============================
// Permanently Delete File
// ==============================
router.delete(
  "/permanent/:id",
  authMiddleware,
  permanentlyDeleteFile
);

module.exports = router;