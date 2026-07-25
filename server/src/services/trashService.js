const fs = require("fs");
const File = require("../models/File");
const { decreaseStorage } = require("./storageService");

// Move file to Trash
const moveToTrash = async (fileId, userId) => {
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

  if (fs.existsSync(file.filePath)) {
    fs.unlinkSync(file.filePath);
  }

  await decreaseStorage(userId, file.fileSize);

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