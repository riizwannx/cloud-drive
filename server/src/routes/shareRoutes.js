const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  shareFile,
  getSharedFiles,
  revokeShare,
  downloadSharedFile,
} = require("../controllers/shareController");

// ==============================
// Public Download Shared File
// ==============================
router.get("/:token", downloadSharedFile);

// ==============================
// Share a File
// ==============================
router.post("/:id", authMiddleware, shareFile);

// ==============================
// Get All Shared Files
// ==============================
router.get("/", authMiddleware, getSharedFiles);

// ==============================
// Revoke Shared Link
// ==============================
router.delete("/:id", authMiddleware, revokeShare);

module.exports = router;