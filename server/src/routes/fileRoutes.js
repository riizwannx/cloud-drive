const express = require("express");
const router = express.Router();

const {
  uploadFile,
  getMyFiles,
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

module.exports = router;