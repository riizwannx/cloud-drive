const mongoose = require("mongoose");
const File = require("../models/File");
const Folder = require("../models/Folder");
const storageService = require("../services/storageService");
const cloudinaryService = require("../services/cloudinaryService");

const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const detectFileTypeFromBuffer = (buffer) => {
  if (!buffer || !Buffer.isBuffer(buffer) || buffer.length < 32) {
    return null;
  }

  // PNG: 8-byte signature: 89 50 4E 47 0D 0A 1A 0A
  // Followed by 4-byte chunk length, then 4-byte chunk type 'IHDR' at offset 12: 49 48 44 52
  if (
    buffer.subarray(0, 8).equals(
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
    ) &&
    buffer.subarray(12, 16).equals(Buffer.from("IHDR"))
  ) {
    return "image/png";
  }

  // JPEG: Starts with SOI marker FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }

  // PDF: Begins with %PDF- (hex: 25 50 44 46 2D)
  if (buffer.subarray(0, 5).toString("ascii") === "%PDF-") {
    return "application/pdf";
  }

  return null;
};

const sanitizeOriginalName = (rawName) => {
  if (typeof rawName !== "string") {
    return "unnamed_file";
  }

  // Normalize Windows backslashes to forward slashes
  const normalized = rawName.replace(/\\/g, "/");
  let baseName = path.basename(normalized);

  // Strip null bytes, control characters, and HTML tag delimiters (< >)
  baseName = baseName.replace(/[\x00-\x1f\x7f-\x9f<>]/g, "").trim();

  // Enforce maximum length of 255 characters while preserving extension
  if (baseName.length > 255) {
    const ext = path.extname(baseName);
    const nameWithoutExt = baseName.slice(0, baseName.length - ext.length);
    baseName = nameWithoutExt.slice(0, Math.max(1, 255 - ext.length)) + ext;
  }

  if (!baseName || baseName === "." || baseName === "..") {
    return "unnamed_file";
  }

  return baseName;
};

const hasExpectedFileSignature = (file) => {
  if (!file || !file.buffer || !Buffer.isBuffer(file.buffer)) {
    return false;
  }

  const detected = detectFileTypeFromBuffer(file.buffer);
  if (!detected) {
    return false;
  }

  const rawName = file.originalname || "";
  const cleanName = sanitizeOriginalName(rawName);
  const ext = path.extname(cleanName).toLowerCase();
  const mimeType = (file.mimetype || "").toLowerCase();

  if (detected === "image/png") {
    return ext === ".png" && mimeType === "image/png";
  }

  if (detected === "image/jpeg") {
    return (
      (ext === ".jpg" || ext === ".jpeg") &&
      (mimeType === "image/jpeg" || mimeType === "image/jpg")
    );
  }

  if (detected === "application/pdf") {
    return ext === ".pdf" && mimeType === "application/pdf";
  }

  return false;
};

const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const isValidObjectId = (id) => {
  return (
    typeof id === "string" &&
    mongoose.Types.ObjectId.isValid(id) &&
    /^[0-9a-fA-F]{24}$/.test(id)
  );
};

const sanitizePagination = (query, defaultLimit = 100, maxLimit = 100) => {
  let limit = defaultLimit;
  let page = 1;
  let skip = 0;

  if (query && typeof query === "object") {
    if (query.limit !== undefined) {
      const parsedLimit = parseInt(query.limit, 10);
      if (!Number.isNaN(parsedLimit) && parsedLimit > 0) {
        limit = Math.min(parsedLimit, maxLimit);
      }
    }

    if (query.page !== undefined) {
      const parsedPage = parseInt(query.page, 10);
      if (!Number.isNaN(parsedPage) && parsedPage > 0) {
        page = parsedPage;
      }
    }

    if (query.skip !== undefined) {
      const parsedSkip = parseInt(query.skip, 10);
      if (!Number.isNaN(parsedSkip) && parsedSkip >= 0) {
        skip = Math.min(parsedSkip, 10000);
      }
    } else {
      skip = Math.min((page - 1) * limit, 10000);
    }
  }

  return { limit, skip, page };
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
  if (file.cloudinaryPublicId || file.cloudinaryUrl || file.cloudinaryType) return true;
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

const formatContentDisposition = (filename) => {
  const raw = typeof filename === "string" ? filename : "download";
  // Discard any CRLF / newline injected payloads to prevent HTTP response splitting
  const sanitizedInput = raw.split(/[\r\n]/)[0];
  // Strip directory traversal
  let clean = path.basename(sanitizedInput.replace(/\\/g, "/"));
  // Strip control characters and null bytes
  clean = clean.replace(/[\x00-\x1f\x7f-\x9f]/g, "").trim();
  if (!clean || clean === "." || clean === "..") {
    clean = "download";
  }
  // Safe ASCII representation: remove quotes, backslashes, non-ASCII
  const safeAscii = clean.replace(/[^\x20-\x7E]/g, "_").replace(/["\\]/g, "");
  // RFC 5987 / RFC 6266 encoded UTF-8 filename
  const encodedUtf8 = encodeURIComponent(clean);

  return `attachment; filename="${safeAscii || "download"}"; filename*=UTF-8''${encodedUtf8}`;
};

const streamFileResponse = async (res, file) => {
  // Set anti-caching and security headers for private authenticated downloads
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  // Legacy local file resolution
  if (isLegacyLocalPath(file.filePath)) {
    const uploadsBase = path.resolve(process.cwd(), "src/uploads");
    const filePath = path.resolve(process.cwd(), file.filePath);

    if (!filePath.startsWith(uploadsBase) || !fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "Physical file not found.",
      });
    }

    const safeName = path.basename((file.originalName || "download").replace(/\\/g, "/")).replace(/[\r\n\x00-\x1f\x7f-\x9f]/g, "");
    return res.download(filePath, safeName || "download");
  }

  // Stream from Cloudinary
  if (isCloudinaryFile(file)) {
    try {
      const fileStream =
        await cloudinaryService.getFileStreamFromCloudinary(file);

      const contentType =
        file.fileType || "application/octet-stream";
      res.setHeader("Content-Type", contentType);

      res.setHeader(
        "Content-Disposition",
        formatContentDisposition(file.originalName)
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
  let currentFileSize = 0;

  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded.",
      });
    }

    const cleanName = sanitizeOriginalName(req.file.originalname);
    const detectedType = detectFileTypeFromBuffer(req.file.buffer);

    if (!hasExpectedFileSignature(req.file) || !detectedType) {
      return res.status(400).json({
        success: false,
        message: "File contents do not match the permitted file type.",
      });
    }

    currentFileSize = req.file.buffer.length;

    // Atomically reserve storage limit
    const storageCheck =
      await storageService.reserveStorage(
        req.user.id,
        currentFileSize
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
      if (
        typeof req.body.folder !== "string" ||
        !mongoose.Types.ObjectId.isValid(req.body.folder) ||
        !/^[0-9a-fA-F]{24}$/.test(req.body.folder)
      ) {
        if (storageReserved) {
          await storageService.decreaseStorage(req.user.id, currentFileSize);
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
          await storageService.decreaseStorage(req.user.id, currentFileSize);
          storageReserved = false;
        }
        return res.status(404).json({
          success: false,
          message: "Folder not found.",
        });
      }

      if (folder.owner.toString() !== req.user.id) {
        if (storageReserved) {
          await storageService.decreaseStorage(req.user.id, currentFileSize);
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
            originalName: cleanName,
            mimeType: detectedType,
            type: "authenticated",
          }
        );
    } catch (uploadError) {
      console.error("Cloudinary upload failed:", uploadError.message);
      if (storageReserved) {
        await storageService.decreaseStorage(req.user.id, currentFileSize);
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
      const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
      const canonicalUnsignedUrl = cloudName
        ? `https://res.cloudinary.com/${cloudName}/${uploadedCloudinaryAsset.resource_type}/authenticated/${uploadedCloudinaryAsset.public_id}`
        : uploadedCloudinaryAsset.public_id;

      newFile = await File.create({
        originalName: cleanName,
        fileName: path.basename(uploadedCloudinaryAsset.public_id),
        filePath: canonicalUnsignedUrl,
        fileType: detectedType,
        fileSize: currentFileSize,
        owner: req.user.id,
        folder: req.body.folder || null,
        cloudinaryPublicId: uploadedCloudinaryAsset.public_id,
        cloudinaryUrl: canonicalUnsignedUrl,
        cloudinaryResourceType: uploadedCloudinaryAsset.resource_type,
        cloudinaryType: uploadedCloudinaryAsset.type || "authenticated",
      });

      storageReserved = false;
    } catch (dbError) {
      console.error("MongoDB File creation failed:", dbError.message);
      // Clean up orphaned Cloudinary asset
      try {
        await cloudinaryService.deleteFileFromCloudinary(
          uploadedCloudinaryAsset.public_id,
          uploadedCloudinaryAsset.resource_type,
          uploadedCloudinaryAsset.type || "authenticated"
        );
      } catch (cleanupErr) {
        console.error(
          "Cloudinary asset rollback error:",
          cleanupErr.message
        );
      }
      // Rollback storage quota
      if (storageReserved) {
        await storageService.decreaseStorage(req.user.id, currentFileSize);
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
    if (storageReserved && currentFileSize > 0) {
      try {
        await storageService.decreaseStorage(req.user.id, currentFileSize);
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
    for (const key of Object.keys(req.query || {})) {
      if (
        key.startsWith("folder[") ||
        key.startsWith("folderId[") ||
        (key.startsWith("folder") && key.includes("["))
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid folder ID.",
        });
      }
    }

    const folderParam =
      req.query.folder !== undefined ? req.query.folder : req.query.folderId;
    const { limit, skip } = sanitizePagination(req.query, 100, 100);

    const query = {
      owner: req.user.id,
      isTrashed: false,
    };

    if (folderParam !== undefined && folderParam !== null && folderParam !== "") {
      if (
        typeof folderParam !== "string" ||
        !isValidObjectId(folderParam)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid folder ID.",
        });
      }

      const folderDoc = await Folder.findById(folderParam);

      if (!folderDoc) {
        return res.status(404).json({
          success: false,
          message: "Folder not found.",
        });
      }

      if (folderDoc.owner.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "Access denied.",
        });
      }

      query.folder = folderParam;
    } else {
      query.folder = null;
    }

    const files = await File.find(query)
      .populate("folder", "name")
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit);

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
    const { limit, skip } = sanitizePagination(req.query, 100, 100);

    if (
      typeof folderId !== "string" ||
      !mongoose.Types.ObjectId.isValid(folderId) ||
      !/^[0-9a-fA-F]{24}$/.test(folderId)
    ) {
      return res.status(404).json({
        success: false,
        message: "Folder not found.",
      });
    }

    const folder = await Folder.findById(folderId);

    if (!folder) {
      return res.status(404).json({
        success: false,
        message: "Folder not found.",
      });
    }

    if (folder.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
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
      })
      .skip(skip)
      .limit(limit);

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

    if (
      !id ||
      typeof id !== "string" ||
      !mongoose.Types.ObjectId.isValid(id) ||
      !/^[0-9a-fA-F]{24}$/.test(id)
    ) {
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

    if (!isValidObjectId(id)) {
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

    if (!isValidObjectId(id)) {
      return res.status(404).json({
        success: false,
        message: "File not found.",
      });
    }

    if (typeof originalName !== "string" || originalName.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "File name is required.",
      });
    }

    if (originalName.trim().length > 255) {
      return res.status(400).json({
        success: false,
        message: "File name must be at most 255 characters.",
      });
    }

    const cleanName = sanitizeOriginalName(originalName.trim());

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

    file.originalName = cleanName;

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

    if (!isValidObjectId(id)) {
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

    if (file.isTrashed) {
      return res.status(400).json({
        success: false,
        message: "Cannot modify favorites for a trashed file.",
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
    const { limit, skip } = sanitizePagination(req.query, 100, 100);
    const files = await File.find({
      owner: req.user.id,
      isFavorite: true,
      isTrashed: false,
    })
      .populate("folder", "name")
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit);

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
    const { limit, skip } = sanitizePagination(req.query, 100, 100);
    const files = await File.find({
      owner: req.user.id,
      isTrashed: true,
    })
      .populate("folder", "name")
      .sort({
        trashedAt: -1,
      })
      .skip(skip)
      .limit(limit);

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

    if (!isValidObjectId(id)) {
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

    if (!isValidObjectId(id)) {
      return res.status(404).json({
        success: false,
        message: "File not found.",
      });
    }

    const existingFile = await File.findById(id);

    if (!existingFile || existingFile.get("isDeleting")) {
      return res.status(404).json({
        success: false,
        message: "File not found.",
      });
    }

    if (existingFile.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

    if (!existingFile.isTrashed) {
      return res.status(400).json({
        success: false,
        message: "File must be in trash before permanent deletion.",
      });
    }

    // Atomic ownership- and state-qualified claim to prevent concurrent races
    const STALE_CLAIM_MS = 30000;
    const staleThreshold = new Date(Date.now() - STALE_CLAIM_MS);

    const file = await File.findOneAndUpdate(
      {
        _id: id,
        owner: req.user.id,
        isTrashed: true,
        $or: [
          { isDeleting: { $ne: true } },
          { deletingAt: { $lt: staleThreshold } },
        ],
      },
      {
        $set: {
          isDeleting: true,
          deletingAt: new Date(),
        },
      },
      {
        returnDocument: "after",
        strict: false,
      }
    );

    if (!file) {
      // Another concurrent request has already claimed or deleted this file
      return res.status(404).json({
        success: false,
        message: "File not found.",
      });
    }

    // Physical storage cleanup (protected by the atomic claim)
    try {
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
    } catch (cleanupError) {
      // Rollback the claim on failure so the file remains intact in trash
      await File.updateOne(
        { _id: id, owner: req.user.id },
        { $unset: { isDeleting: "", deletingAt: "" } },
        { strict: false }
      );
      throw cleanupError;
    }

    await storageService.decreaseStorage(
      req.user.id,
      file.fileSize
    );

    await File.deleteOne({ _id: id });

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
    for (const key of Object.keys(req.query || {})) {
      if (key.startsWith("name[") || (key.startsWith("name") && key.includes("["))) {
        return res.status(400).json({
          success: false,
          message: "Search query must be a string.",
        });
      }
    }

    const { name } = req.query;

    if (name !== undefined) {
      if (typeof name !== "string") {
        return res.status(400).json({
          success: false,
          message: "Search query must be a string.",
        });
      }
      if (name.length > 100) {
        return res.status(400).json({
          success: false,
          message: "Search query must be at most 100 characters.",
        });
      }
    }

    const { limit, skip } = sanitizePagination(req.query, 100, 100);

    const searchTerm =
      name && typeof name === "string" ? escapeRegex(name.trim()) : "";

    const files = await File.find({
      owner: req.user.id,
      originalName: {
        $regex: searchTerm,
        $options: "i",
      },
      isTrashed: false,
    })
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit);

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

    if (!isValidObjectId(id)) {
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
    const { limit, skip } = sanitizePagination(req.query, 100, 100);
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
      })
      .skip(skip)
      .limit(limit);

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

    if (!isValidObjectId(id)) {
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

    if (!token || typeof token !== "string" || token.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Share token is required.",
      });
    }

    if (token.length > 128) {
      return res.status(400).json({
        success: false,
        message: "Invalid share token.",
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

    if (!token || typeof token !== "string" || token.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Share token is required.",
      });
    }

    if (token.length > 128) {
      return res.status(400).json({
        success: false,
        message: "Invalid share token.",
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

  // File Upload Security Helpers
  detectFileTypeFromBuffer,
  sanitizeOriginalName,
  hasExpectedFileSignature,

  // File Download / Access Security Helpers
  formatContentDisposition,
  streamFileResponse,

  // Resource / Abuse Security Helpers
  sanitizePagination,

  // Database / ObjectId Validation Helper
  isValidObjectId,
};

