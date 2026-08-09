const File = require("../models/File");
const storageService = require("../services/storageService");

const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

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
    const storageCheck =
      await storageService.checkStorageLimit(
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
      folder: req.body.folder || null,
    });

    // Increase user's storage usage
    await storageService.increaseStorage(
      req.user.id,
      req.file.size
    );

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
    const { folder } = req.query;

    const query = {
      owner: req.user.id,
      isTrashed: false,
    };

    if (folder) {
      query.folder = folder;
    } else {
      query.folder = null;
    }

    const files = await File.find(query)
      .populate("folder", "name")
      .sort({
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
// Get Files By Folder
// ==============================
const getFilesByFolder = async (req, res) => {
  try {
    const { folderId } = req.params;

    const files = await File.find({
      owner: req.user.id,
      folder: folderId,
      isTrashed: false,
    })
      .populate("folder", "name")
      .sort({
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

    const filePath = path.join(
      process.cwd(),
      file.filePath
    );

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "Physical file not found.",
      });
    }

    return res.download(
      filePath,
      file.originalName
    );
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==============================
// Move File to Trash
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

    file.isTrashed = true;
    file.trashedAt = new Date();

    // Automatically disable sharing when moved to trash
    file.isShared = false;
    file.shareToken = null;

    await file.save();

    return res.status(200).json({
      success: true,
      message: "File moved to trash.",
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
// Toggle Favorite
// ==============================
const toggleFavorite = async (req, res) => {
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

    file.isFavorite = !file.isFavorite;

    await file.save();

    return res.status(200).json({
      success: true,
      message: file.isFavorite
        ? "File added to favorites."
        : "File removed from favorites.",
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
// Get Favorite Files
// ==============================
const getFavoriteFiles = async (req, res) => {
  try {
    const files = await File.find({
      owner: req.user.id,
      isFavorite: true,
      isTrashed: false,
    })
      .populate("folder", "name")
      .sort({
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
// Get Trash Files
// ==============================
const getTrashFiles = async (req, res) => {
  try {
    const files = await File.find({
      owner: req.user.id,
      isTrashed: true,
    })
      .populate("folder", "name")
      .sort({
        trashedAt: -1,
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
// Restore File
// ==============================
const restoreFile = async (req, res) => {
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

    file.isTrashed = false;
    file.trashedAt = null;

    await file.save();

    return res.status(200).json({
      success: true,
      message: "File restored successfully.",
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
// Permanently Delete File
// ==============================
const permanentlyDeleteFile = async (req, res) => {
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

    const filePath = path.join(
      process.cwd(),
      file.filePath
    );

    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }

    await storageService.decreaseStorage(
      req.user.id,
      file.fileSize
    );

    await file.deleteOne();

    return res.status(200).json({
      success: true,
      message: "File permanently deleted.",
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

    const searchTerm = name
      ? name.trim()
      : "";

    const files = await File.find({
      owner: req.user.id,
      originalName: {
        $regex: searchTerm,
        $options: "i",
      },
      isTrashed: false,
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

// ============================================================
// SHARE SYSTEM
// ============================================================

// ==============================
// Share File
// ==============================
const shareFile = async (req, res) => {
  try {
    const { id } = req.params;

    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found.",
      });
    }

    // Only owner can share
    if (file.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

    // Don't allow sharing trashed files
    if (file.isTrashed) {
      return res.status(400).json({
        success: false,
        message:
          "A file in trash cannot be shared.",
      });
    }

    // Reuse existing token if already shared
    if (!file.isShared || !file.shareToken) {
      file.shareToken = crypto.randomBytes(32).toString("hex");
      file.isShared = true;

      await file.save();
    }

    return res.status(200).json({
      success: true,
      message: "File shared successfully.",
      shareToken: file.shareToken,
      fileId: file._id,
      fileName: file.originalName,
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
// Get My Shared Files
// ==============================
const getSharedFiles = async (req, res) => {
  try {
    const files = await File.find({
      owner: req.user.id,
      isShared: true,
      isTrashed: false,
      shareToken: {
        $ne: null,
      },
    })
      .populate("folder", "name")
      .sort({
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
// Remove Share
// ==============================
const removeShare = async (req, res) => {
  try {
    const { id } = req.params;

    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found.",
      });
    }

    // Only owner can remove sharing
    if (file.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

    file.isShared = false;
    file.shareToken = null;

    await file.save();

    return res.status(200).json({
      success: true,
      message: "File sharing removed successfully.",
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
// Access Shared File
// ==============================
// Public endpoint.
// No JWT is required.
// The share token acts as the access credential.
const accessSharedFile = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Share token is required.",
      });
    }

    const file = await File.findOne({
      shareToken: token,
      isShared: true,
      isTrashed: false,
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message:
          "Shared file not found or sharing has been removed.",
      });
    }

    const filePath = path.join(
      process.cwd(),
      file.filePath
    );

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "Physical file not found.",
      });
    }

    return res.download(
      filePath,
      file.originalName
    );
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
// ==============================
// Get Shared File Information
// ==============================
const getSharedFileInfo = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Share token is required.",
      });
    }

    const file = await File.findOne({
      shareToken: token,
      isShared: true,
      isTrashed: false,
    }).select(
      "originalName fileType fileSize createdAt"
    );

    if (!file) {
      return res.status(404).json({
        success: false,
        message:
          "Shared file not found or sharing has been removed.",
      });
    }

    return res.status(200).json({
      success: true,
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
// Export Controllers
// ==============================
module.exports = {
  uploadFile,
  getMyFiles,
  getFilesByFolder,
  downloadFile,
  deleteFile,
  renameFile,
  toggleFavorite,
  getFavoriteFiles,
  getTrashFiles,
  restoreFile,
  permanentlyDeleteFile,
  searchFiles,

  // Share
  shareFile,
  getSharedFiles,
  removeShare,
  accessSharedFile,
  getSharedFileInfo,
};