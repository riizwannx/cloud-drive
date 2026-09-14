const mongoose = require("mongoose");
const File = require("../models/File");

const isValidObjectId = (id) =>
  typeof id === "string" &&
  mongoose.Types.ObjectId.isValid(id) &&
  /^[0-9a-fA-F]{24}$/.test(id);

const toggleFavorite = async (fileId, userId) => {
  if (!isValidObjectId(fileId)) {
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
      message: "Access denied.",
    };
  }

  if (file.isTrashed) {
    return {
      success: false,
      status: 400,
      message: "Cannot modify favorites for a trashed file.",
    };
  }

  file.isFavorite = !file.isFavorite;

  await file.save();

  return {
    success: true,
    message: file.isFavorite
      ? "File added to favorites."
      : "File removed from favorites.",
    file,
  };
};

const getFavoriteFiles = async (userId) => {
  const files = await File.find({
    owner: userId,
    isFavorite: true,
    isTrashed: false,
  }).sort({
    createdAt: -1,
  });

  return {
    success: true,
    count: files.length,
    files,
  };
};

module.exports = {
  toggleFavorite,
  getFavoriteFiles,
};