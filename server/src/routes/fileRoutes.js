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

  // Share
  shareFile,
  getSharedFiles,
  removeShare,
  accessSharedFile,
  getSharedFileInfo,
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
router.get(
  "/",
  authMiddleware,
  getMyFiles
);

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
// Download Owned File
// ==============================
router.get(
  "/download/:id",
  authMiddleware,
  downloadFile
);

// ============================================================
// SHARE ROUTES
// ============================================================

// ==============================
// Get My Shared Files
// ==============================
router.get(
  "/shared",
  authMiddleware,
  getSharedFiles
);

// ==============================
// Access Shared File
// ==============================
// Public route.
// IMPORTANT: Keep this before "/:id"
// routes.
router.get(
  "/shared/:token",
  accessSharedFile
);

// ==============================
// Share File
// ==============================
router.patch(
  "/share/:id",
  authMiddleware,
  shareFile
);

// ==============================
// Remove Share
// ==============================
router.patch(
  "/share/remove/:id",
  authMiddleware,
  removeShare
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

router.get(
  "/shared/:token/info",
  getSharedFileInfo
);

module.exports = router;