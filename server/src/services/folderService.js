const Folder = require("../models/Folder");
const File = require("../models/File");

// ==============================
// Create Folder
// ==============================
const createFolder = async (
  name,
  owner,
  parentFolder = null
) => {
  const trimmedName = name?.trim();

  if (!trimmedName) {
    return {
      success: false,
      status: 400,
      message: "Folder name is required.",
    };
  }

  // ==============================
  // Validate Parent Folder
  // ==============================

  if (parentFolder) {
    const parent = await Folder.findById(parentFolder);

    if (!parent) {
      return {
        success: false,
        status: 404,
        message: "Parent folder not found.",
      };
    }

    if (parent.owner.toString() !== owner.toString()) {
      return {
        success: false,
        status: 403,
        message: "Unauthorized parent folder.",
      };
    }
  }

  // ==============================
  // Check Duplicate Folder
  // ==============================

  const existingFolder = await Folder.findOne({
    name: trimmedName,
    owner,
    parentFolder: parentFolder || null,
  });

  if (existingFolder) {
    return {
      success: false,
      status: 400,
      message:
        "A folder with this name already exists here.",
    };
  }

  // ==============================
  // Create Folder
  // ==============================

  const folder = await Folder.create({
    name: trimmedName,
    owner,
    parentFolder: parentFolder || null,
  });

  return {
    success: true,
    status: 201,
    message: "Folder created successfully.",
    folder,
  };
};

// ==============================
// Get Folders
// ==============================
const getFolders = async (
  owner,
  parentFolder = null
) => {
  const folders = await Folder.find({
    owner,
    parentFolder: parentFolder || null,
  }).sort({
    createdAt: -1,
  });

  return {
    success: true,
    status: 200,
    count: folders.length,
    folders,
  };
};

// ==============================
// Get Single Folder
// ==============================
const getFolder = async (
  folderId,
  owner
) => {
  const folder = await Folder.findById(
    folderId
  );

  if (!folder) {
    return {
      success: false,
      status: 404,
      message: "Folder not found.",
    };
  }

  if (
    folder.owner.toString() !==
    owner.toString()
  ) {
    return {
      success: false,
      status: 403,
      message: "Unauthorized access.",
    };
  }

  return {
    success: true,
    status: 200,
    folder,
  };
};

// ==============================
// Rename Folder
// ==============================
const renameFolder = async (
  folderId,
  owner,
  name
) => {
  const trimmedName = name?.trim();

  if (!trimmedName) {
    return {
      success: false,
      status: 400,
      message: "Folder name is required.",
    };
  }

  const folder = await Folder.findById(
    folderId
  );

  if (!folder) {
    return {
      success: false,
      status: 404,
      message: "Folder not found.",
    };
  }

  if (
    folder.owner.toString() !==
    owner.toString()
  ) {
    return {
      success: false,
      status: 403,
      message: "Unauthorized access.",
    };
  }

  // ==============================
  // Check Duplicate Name
  // ==============================

  const existingFolder =
    await Folder.findOne({
      _id: { $ne: folderId },
      name: trimmedName,
      owner,
      parentFolder:
        folder.parentFolder || null,
    });

  if (existingFolder) {
    return {
      success: false,
      status: 400,
      message:
        "A folder with this name already exists here.",
    };
  }

  folder.name = trimmedName;

  await folder.save();

  return {
    success: true,
    status: 200,
    message: "Folder renamed successfully.",
    folder,
  };
};

// ==============================
// Delete Folder
// ==============================
const deleteFolder = async (
  folderId,
  owner
) => {
  const folder = await Folder.findById(
    folderId
  );

  if (!folder) {
    return {
      success: false,
      status: 404,
      message: "Folder not found.",
    };
  }

  if (
    folder.owner.toString() !==
    owner.toString()
  ) {
    return {
      success: false,
      status: 403,
      message: "Unauthorized access.",
    };
  }

  // ==============================
  // Check Files
  // ==============================

  const files =
    await File.countDocuments({
      owner,
      folder: folderId,
      isTrashed: false,
    });

  if (files > 0) {
    return {
      success: false,
      status: 400,
      message:
        "Cannot delete a folder that contains files.",
    };
  }

  // ==============================
  // Check Child Folders
  // ==============================

  const childFolders =
    await Folder.countDocuments({
      owner,
      parentFolder: folderId,
    });

  if (childFolders > 0) {
    return {
      success: false,
      status: 400,
      message:
        "Cannot delete a folder that contains subfolders.",
    };
  }

  // ==============================
  // Delete Folder
  // ==============================

  await folder.deleteOne();

  return {
    success: true,
    status: 200,
    message: "Folder deleted successfully.",
  };
};

// ==============================
// Exports
// ==============================

module.exports = {
  createFolder,
  getFolders,
  getFolder,
  renameFolder,
  deleteFolder,
};