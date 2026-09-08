const mongoose = require("mongoose");
const File = require("../models/File");
const Folder = require("../models/Folder");
const storageService = require("../services/storageService");
const cloudinaryService = require("../services/cloudinaryService");

const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const hasExpectedFileSignature = (file) => {
  if (!file || !file.buffer || !Buffer.isBuffer(file.buffer)) {
    return false;
  }

  const header = file.buffer.subarray(0, 12);

  if (file.mimetype === "application/pdf") {
    return header.subarray(0, 5).toString() === "%PDF-";
  }

  if (["image/jpeg", "image/jpg"].includes(file.mimetype)) {
    return header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff;
  }

  if (file.mimetype === "image/png") {
    return header.subarray(0, 8).equals(
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
    );
  }

  return false;
};

const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const isLegacyLocalPath = (filePath) => {
  if (!filePath || typeof filePath !== "string") {
    return false;
  }
  const normalized = filePath.replace(/\\/g, "/");
  return normalized.startsWith("src/uploads");
};

const isCloudinaryFile = (file) => {
  if (!file) return false;
  if (file.cloudinaryPublicId || file.cloudinaryUrl) return true;
  if (typeof file.filePath === "string") {
    if (
      file.filePath.startsWith("http://") ||
      file.filePath.startsWith("https://") ||
      file.filePath.startsWith("clouddrive/")
    ) {
      return true;
    }
  }
  return false;
};

const streamFileResponse = async (res, file) => {
  // Legacy local file resolution
  if (isLegacyLocalPath(file.filePath)) {
    const filePath = path.join(process.cwd(), file.filePath);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "Physical file not found.",
      });
    }

    return res.download(filePath, file.originalName);
  }

  // Stream from Cloudinary
  if (isCloudinaryFile(file)) {
    try {
      const fileStream =
        await cloudinaryService.getFileStreamFromCloudinary(file);

      const contentType =
        file.fileType || "application/octet-stream";
      res.setHeader("Content-Type", contentType);

      const filename = file.originalName || "download";
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename.replace(/"/g, '\\"')}"`
      );

      if (file.fileSize) {
        res.setHeader("Content-Length", file.fileSize);
      }

      fileStream.on("error", (streamErr) => {
        console.error("Cloudinary stream error:", streamErr.message);
        if (!res.headersSent) {
          return res.status(500).json({
            success: false,
            message: "Error streaming file.",
          });
        }
      });

      res.on("close", () => {
        if (
          fileStream &&
          typeof fileStream.destroy === "function" &&
          !fileStream.destroyed
        ) {
          fileStream.destroy();
        }
      });

      return fileStream.pipe(res);
    } catch (err) {
      if (err.statusCode === 404 || err.message?.includes("not found")) {
        return res.status(404).json({
          success: false,
          message: "Physical file not found.",
        });
      }

      console.error("Cloudinary download error:", err.message);
      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  }

  // Unhandled legacy or obsolete records
  return res.status(404).json({
    success: false,
    message: "Physical file not found.",
  });
};

// ==============================
// Upload File
// ==============================
const uploadFile = async (req, res) => {
  let storageReserved = false;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded.",
      });
    }

    if (!hasExpectedFileSignature(req.file)) {
      return res.status(400).json({
        success: false,
        message: "File contents do not match the permitted file type.",
      });
    }

    // Atomically reserve storage limit
    const storageCheck =
      await storageService.reserveStorage(
        req.user.id,
        req.file.size
      );

    if (!storageCheck.success) {
      return res.status(storageCheck.status).json({
        success: false,
        message: storageCheck.message,
      });
    }

    storageReserved = true;

    // Validate folder ownership if folder is provided
    if (req.body.folder) {
      if (!mongoose.Types.ObjectId.isValid(req.body.folder)) {
        if (storageReserved) {
          await storageService.decreaseStorage(req.user.id, req.file.size);
          storageReserved = false;
        }
        return res.status(404).json({
          success: false,
          message: "Folder not found.",
        });
      }

      const folder = await Folder.findById(req.body.folder);

      if (!folder) {
        if (storageReserved) {
          await storageService.decreaseStorage(req.user.id, req.file.size);
          storageReserved = false;
        }
        return res.status(404).json({
          success: false,
          message: "Folder not found.",
        });
      }

      if (folder.owner.toString() !== req.user.id) {
        if (storageReserved) {
          await storageService.decreaseStorage(req.user.id, req.file.size);
          storageReserved = false;
        }
        return res.status(403).json({
          success: false,
          message: "Access denied.",
        });
      }
    }

    // Upload validated file buffer to Cloudinary
    let uploadedCloudinaryAsset = null;
    try {
      uploadedCloudinaryAsset =
        await cloudinaryService.uploadFileToCloudinary(
          req.file.buffer,
          {
            originalName: req.file.originalname,
            mimeType: req.file.mimetype,
          }
        );
    } catch (uploadError) {
      console.error("Cloudinary upload failed:", uploadError.message);
      if (storageReserved) {
        await storageService.decreaseStorage(req.user.id, req.file.size);
        storageReserved = false;
      }
      return res.status(500).json({
        success: false,
        message: "File upload failed.",
      });
    }

    // Save file information in MongoDB
    let newFile;
    try {
      newFile = await File.create({
        originalName: req.file.originalname,
        fileName: path.basename(uploadedCloudinaryAsset.public_id),
        filePath:
          uploadedCloudinaryAsset.secure_url ||
          uploadedCloudinaryAsset.public_id,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        owner: req.user.id,
        folder: req.body.folder || null,
        cloudinaryPublicId: uploadedCloudinaryAsset.public_id,
        cloudinaryUrl: uploadedCloudinaryAsset.secure_url,
        cloudinaryResourceType: uploadedCloudinaryAsset.resource_type,
      });

      storageReserved = false;
    } catch (dbError) {
      console.error("MongoDB File creation failed:", dbError.message);
      // Clean up orphaned Cloudinary asset
      try {
        await cloudinaryService.deleteFileFromCloudinary(
          uploadedCloudinaryAsset.public_id,
          uploadedCloudinaryAsset.resource_type
        );
      } catch (cleanupErr) {
        console.error(
          "Cloudinary asset rollback error:",
          cleanupErr.message
        );
      }
      // Rollback storage quota
      if (storageReserved) {
        await storageService.decreaseStorage(req.user.id, req.file.size);
        storageReserved = false;
      }
      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }

    return res.status(201).json({
      success: true,
      message: "File uploaded successfully.",
      file: newFile,
    });
  } catch (error) {
    console.error("Upload File Error:", error.message);

    // Rollback reserved storage on unexpected failure
    if (storageReserved) {
      try {
        await storageService.decreaseStorage(req.user.id, req.file.size);
      } catch (rollbackError) {
        console.error("Storage rollback error:", rollbackError.message);
      }
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
      if (!mongoose.Types.ObjectId.isValid(folder)) {
        return res.status(400).json({
          success: false,
          message: "Invalid folder ID.",
        });
      }
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

    if (!mongoose.Types.ObjectId.isValid(folderId)) {
      return res.status(404).json({
        success: false,
        message: "Folder not found.",
      });
    }

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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: "File not found.",
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

    return await streamFileResponse(res, file);
  } catch (error) {
    console.error("Download Error:", error.message);

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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: "File not found.",
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: "File not found.",
      });
    }

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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: "File not found.",
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: "File not found.",
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

    if (file.folder) {
      const folderExists = await Folder.exists({
        _id: file.folder,
        owner: req.user.id,
      });

      if (!folderExists) {
        file.folder = null;
      }
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: "File not found.",
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

    // Physical storage cleanup before database deletion
    if (isLegacyLocalPath(file.filePath)) {
      const filePath = path.join(
        process.cwd(),
        file.filePath
      );

      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
    } else if (isCloudinaryFile(file)) {
      await cloudinaryService.deleteFileFromCloudinary(file);
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
    console.error("Permanent Delete Error:", error.message);

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

    const searchTerm =
      name && typeof name === "string" ? escapeRegex(name.trim()) : "";

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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: "File not found.",
      });
    }

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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: "File not found.",
      });
    }

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

    return await streamFileResponse(res, file);
  } catch (error) {
    console.error("Access Shared File Error:", error.message);

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
