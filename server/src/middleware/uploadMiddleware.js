const multer = require("multer");

// Configure Storage
const storage = multer.memoryStorage();

// File Filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "application/pdf",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, PNG, and PDF files are allowed."), false);
  }
};

// Upload Middleware
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB per file
    files: 1, // Single file upload
    fields: 10, // Max non-file fields
    parts: 20, // Max total parts
    fieldSize: 1024 * 1024, // 1 MB max non-file field value
  },
});

module.exports = upload;