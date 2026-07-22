const express = require("express");
const router = express.Router();

const {
  uploadFile,
  getMyFiles,
  downloadFile,
  deleteFile,
  renameFile,
  searchFiles,
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
// Search Files
// ==============================
router.get("/search", authMiddleware, searchFiles);

// ==============================
// Download File
// ==============================
router.get("/download/:id", authMiddleware, downloadFile);

// ==============================
// Rename File
// ==============================
router.put("/:id", authMiddleware, renameFile);

// ==============================
// Delete File
// ==============================
router.delete("/:id", authMiddleware, deleteFile);

module.exports = router;