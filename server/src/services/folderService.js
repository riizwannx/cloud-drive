const Folder = require("../models/Folder");
const File = require("../models/File");

// Create Folder
const createFolder = async (name, owner, parentFolder = null) => {
  const existingFolder = await Folder.findOne({
    name,
    owner,
    parentFolder,
  });

  if (existingFolder) {
    return {
      success: false,
      status: 400,
      message: "Folder already exists.",
    };
  }

  const folder = await Folder.create({
    name,
    owner,
    parentFolder,
  });

  return {
    success: true,
    status: 201,
    message: "Folder created successfully.",
    folder,
  };
};

// Get All Folders
const getFolders = async (owner) => {
  const folders = await Folder.find({ owner }).sort({ createdAt: -1 });

  return {
    success: true,
    status: 200,
    count: folders.length,
    folders,
  };
};

// Get Single Folder
const getFolder = async (folderId, owner) => {
  const folder = await Folder.findById(folderId);

  if (!folder) {
    return {
      success: false,
      status: 404,
      message: "Folder not found.",
    };
  }

  if (folder.owner.toString() !== owner) {
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

// Rename Folder
const renameFolder = async (folderId, owner, name) => {
  const folder = await Folder.findById(folderId);

  if (!folder) {
    return {
      success: false,
      status: 404,
      message: "Folder not found.",
    };
  }

  if (folder.owner.toString() !== owner) {
    return {
      success: false,
      status: 403,
      message: "Unauthorized access.",
    };
  }

  folder.name = name;

  await folder.save();

  return {
    success: true,
    status: 200,
    message: "Folder renamed successfully.",
    folder,
  };
};

// Delete Folder
const deleteFolder = async (folderId, owner) => {
  const folder = await Folder.findById(folderId);

  if (!folder) {
    return {
      success: false,
      status: 404,
      message: "Folder not found.",
    };
  }

  if (folder.owner.toString() !== owner) {
    return {
      success: false,
      status: 403,
      message: "Unauthorized access.",
    };
  }

  const files = await File.countDocuments({
    owner,
    folder: folderId,
    isTrashed: false,
  });

  if (files > 0) {
    return {
      success: false,
      status: 400,
      message: "Cannot delete a folder that contains files.",
    };
  }

  await folder.deleteOne();

  return {
    success: true,
    status: 200,
    message: "Folder deleted successfully.",
  };
};

module.exports = {
  createFolder,
  getFolders,
  getFolder,
  renameFolder,
  deleteFolder,
};