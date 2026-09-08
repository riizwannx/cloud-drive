const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const File = require("../models/File");
const Folder = require("../models/Folder");
const storageService = require("./storageService");
const cloudinaryService = require("./cloudinaryService");

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

// Move file to Trash
const moveToTrash = async (fileId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(fileId)) {
    return {
      success: false,
      status: 404,
      message: "File not found.",
    };
  }

  const file = await File.findById(fileId);

  if (!file) {
    return {
      success: false,
      status: 404,
      message: "File not found.",
    };
  }

  if (file.owner.toString() !== userId) {
    return {
      success: false,
      status: 403,
      message: "Unauthorized access.",
    };
  }

  if (file.isTrashed) {
    return {
      success: false,
      status: 400,
      message: "File is already in Trash.",
    };
  }

  file.isTrashed = true;
  file.trashedAt = new Date();

  await file.save();

  return {
    success: true,
    status: 200,
    message: "File moved to Trash successfully.",
    file,
  };
};

// Get all trashed files
const getTrashedFiles = async (userId) => {
  const files = await File.find({
    owner: userId,
    isTrashed: true,
  }).sort({ trashedAt: -1 });

  return {
    success: true,
    status: 200,
    count: files.length,
    files,
  };
};

// Restore file
const restoreFile = async (fileId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(fileId)) {
    return {
      success: false,
      status: 404,
      message: "File not found.",
    };
  }

  const file = await File.findById(fileId);

  if (!file) {
    return {
      success: false,
      status: 404,
      message: "File not found.",
    };
  }

  if (file.owner.toString() !== userId) {
    return {
      success: false,
      status: 403,
      message: "Unauthorized access.",
    };
  }

  if (!file.isTrashed) {
    return {
      success: false,
      status: 400,
      message: "File is not in Trash.",
    };
  }

  if (file.folder) {
    const folderExists = await Folder.exists({
      _id: file.folder,
      owner: userId,
    });

    if (!folderExists) {
      file.folder = null;
    }
  }

  file.isTrashed = false;
  file.trashedAt = null;

  await file.save();

  return {
    success: true,
    status: 200,
    message: "File restored successfully.",
    file,
  };
};

// Permanently delete file
const permanentlyDeleteFile = async (fileId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(fileId)) {
    return {
      success: false,
      status: 404,
      message: "File not found.",
    };
  }

  const file = await File.findById(fileId);

  if (!file) {
    return {
      success: false,
      status: 404,
      message: "File not found.",
    };
  }

  if (file.owner.toString() !== userId) {
    return {
      success: false,
      status: 403,
      message: "Unauthorized access.",
    };
  }

  if (!file.isTrashed) {
    return {
      success: false,
      status: 400,
      message: "Move the file to Trash before permanently deleting it.",
    };
  }

  // Physical storage cleanup before database deletion
  if (isLegacyLocalPath(file.filePath)) {
    const localPath = path.isAbsolute(file.filePath)
      ? file.filePath
      : path.join(process.cwd(), file.filePath);
    if (fs.existsSync(localPath)) {
      await fs.promises.unlink(localPath);
    }
  } else if (isCloudinaryFile(file)) {
    await cloudinaryService.deleteFileFromCloudinary(file);
  }

  await storageService.decreaseStorage(userId, file.fileSize);

  await file.deleteOne();

  return {
    success: true,
    status: 200,
    message: "File permanently deleted.",
  };
};

module.exports = {
  moveToTrash,
  getTrashedFiles,
  restoreFile,
  permanentlyDeleteFile,
};