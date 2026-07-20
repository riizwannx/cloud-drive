const express = require("express");
const router = express.Router();

const { uploadFile } = require("../controllers/fileController");
const upload = require("../middleware/uploadMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

// Protected Upload Route
router.post("/upload", authMiddleware, upload.single("file"), uploadFile);

module.exports = router;