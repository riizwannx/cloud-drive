const File = require("../models/File");
const storageService = require("../services/storageService");
const path = require("path");
const fs = require("fs");

// ==============================
// Upload File
// ==============================
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded.",
      });
    }

    // Check storage limit
    const storageCheck = await storageService.checkStorageLimit(
      req.user.id,
      req.file.size
    );

    if (!storageCheck.success) {
      // Delete uploaded file if storage limit exceeded
      if (fs.existsSync(req.file.path)) {
        await fs.promises.unlink(req.file.path);
      }

      return res.status(storageCheck.status).json({
        success: false,
        message: storageCheck.message,
      });
    }

    // Save file information
    const newFile = await File.create({
      originalName: req.file.originalname,
      fileName: req.file.filename,
      filePath: req.file.path,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      owner: req.user.id,
    });

    // Increase user's storage usage
    await storageService.increaseStorage(req.user.id, req.file.size);

    return res.status(201).json({
      success: true,
      message: "File uploaded successfully.",
      file: newFile,
    });
  } catch (error) {
    console.error(error);

    // Delete uploaded file if an unexpected error occurs
    if (req.file && fs.existsSync(req.file.path)) {
      await fs.promises.unlink(req.file.path);
    }

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==============================
// Get My Files
// ==============================
const getMyFiles = async (req, res) => {
  try {
    const files = await File.find({
      owner: req.user.id,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: files.length,
      files,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==============================
// Download File
// ==============================
const downloadFile = async (req, res) => {
  try {
    const { id } = req.params;

    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found.",
      });
    }

    if (file.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

    const filePath = path.join(process.cwd(), file.filePath);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "Physical file not found.",
      });
    }

    return res.download(filePath, file.originalName);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==============================
// Delete File
// ==============================
const deleteFile = async (req, res) => {
  try {
    const { id } = req.params;

    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found.",
      });
    }

    if (file.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

    const filePath = path.join(process.cwd(), file.filePath);
        if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }

    // Decrease user's storage usage
    await storageService.decreaseStorage(req.user.id, file.fileSize);

    await file.deleteOne();

    return res.status(200).json({
      success: true,
      message: "File deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==============================
// Rename File
// ==============================
const renameFile = async (req, res) => {
  try {
    const { id } = req.params;
    const { originalName } = req.body;

    if (!originalName || originalName.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "File name is required.",
      });
    }

    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found.",
      });
    }

    if (file.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

    file.originalName = originalName.trim();

    await file.save();

    return res.status(200).json({
      success: true,
      message: "File renamed successfully.",
      file,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==============================
// Search Files
// ==============================
const searchFiles = async (req, res) => {
  try {
    const { name } = req.query;

    const searchTerm = name ? name.trim() : "";

    const files = await File.find({
      owner: req.user.id,
      originalName: {
        $regex: searchTerm,
        $options: "i",
      },
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: files.length,
      files,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==============================
// Export Controllers
// ==============================
module.exports = {
  uploadFile,
  getMyFiles,
  downloadFile,
  deleteFile,
  renameFile,
  searchFiles,
};