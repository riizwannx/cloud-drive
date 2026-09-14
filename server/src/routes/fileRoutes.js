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
const { rateLimit, ipKeyGenerator } = require("express-rate-limit");

// Rate Limiter: Upload abuse protection (50 uploads per 15 minutes per user)
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: false,
  legacyHeaders: false,
  keyGenerator: (req) => {
    if (req.user?.id) {
      return `upload-user:${req.user.id}`;
    }
    return `upload-ip:${ipKeyGenerator(req.ip || "127.0.0.1")}`;
  },
  validate: {
    xForwardedForHeader: false,
    default: true,
  },
  message: {
    success: false,
    message: "Too many upload requests. Please try again later.",
  },
});

// Rate Limiter: Download & streaming abuse protection (100 downloads per 15 minutes per user)
const downloadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: false,
  legacyHeaders: false,
  keyGenerator: (req) => {
    if (req.user?.id) {
      return `download-user:${req.user.id}`;
    }
    return `download-ip:${ipKeyGenerator(req.ip || "127.0.0.1")}`;
  },
  validate: {
    xForwardedForHeader: false,
    default: true,
  },
  message: {
    success: false,
    message: "Too many download requests. Please try again later.",
  },
});

// Rate Limiter: Search abuse protection (60 search requests per 15 minutes per user)
const searchLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: false,
  legacyHeaders: false,
  keyGenerator: (req) => {
    if (req.user?.id) {
      return `search-user:${req.user.id}`;
    }
    return `search-ip:${ipKeyGenerator(req.ip || "127.0.0.1")}`;
  },
  validate: {
    xForwardedForHeader: false,
    default: true,
  },
  message: {
    success: false,
    message: "Too many search requests. Please try again later.",
  },
});

// Rate Limiter: Public share token abuse & scraping protection (60 requests per 15 minutes per IP)
const publicShareLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: false,
  legacyHeaders: false,
  keyGenerator: (req) => `share-ip:${ipKeyGenerator(req.ip || "127.0.0.1")}`,
  validate: {
    xForwardedForHeader: false,
    default: true,
  },
  message: {
    success: false,
    message: "Too many shared file requests. Please try again later.",
  },
});

// Rate Limiter: Permanent deletion abuse protection (60 requests per 15 minutes per user)
const permanentDeleteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: false,
  legacyHeaders: false,
  keyGenerator: (req) => {
    if (req.user?.id) {
      return `permanent-delete-user:${req.user.id}`;
    }
    return `permanent-delete-ip:${ipKeyGenerator(req.ip || "127.0.0.1")}`;
  },
  validate: {
    xForwardedForHeader: false,
    default: true,
  },
  message: {
    success: false,
    message: "Too many deletion requests. Please try again later.",
  },
});

// ==============================
// Upload File
// ==============================
router.post(
  "/upload",
  authMiddleware,
  uploadLimiter,
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
  searchLimiter,
  searchFiles
);

// ==============================
// Download Owned File
// ==============================
router.get(
  "/download/:id",
  authMiddleware,
  downloadLimiter,
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
  publicShareLimiter,
  accessSharedFile
);

router.get(
  "/shared/:token/info",
  publicShareLimiter,
  getSharedFileInfo
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
router.patch(
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
  permanentDeleteLimiter,
  permanentlyDeleteFile
);

router.permanentDeleteLimiter = permanentDeleteLimiter;

module.exports = router;