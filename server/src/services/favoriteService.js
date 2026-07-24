const File = require("../models/File");

const toggleFavorite = async (fileId, userId) => {
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