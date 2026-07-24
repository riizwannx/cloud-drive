const User = require("../models/User");
const File = require("../models/File");

const getDashboardData = async (userId) => {
  const user = await User.findById(userId).select(
    "storageUsed storageLimit isVIP"
  );

  if (!user) {
    return {
      success: false,
      status: 404,
      message: "User not found.",
    };
  }

  // Total files
  const totalFiles = await File.countDocuments({
    owner: userId,
  });

  // PDF files
  const pdfFiles = await File.countDocuments({
    owner: userId,
    fileType: "application/pdf",
  });

  // Image files
  const imageFiles = await File.countDocuments({
    owner: userId,
    fileType: {
      $regex: "^image/",
      $options: "i",
    },
  });

  // Other files
  const otherFiles = totalFiles - pdfFiles - imageFiles;

  // Recent uploaded files
  const recentFiles = await File.find({
    owner: userId,
  })
    .select("originalName fileType fileSize createdAt")
    .sort({ createdAt: -1 })
    .limit(5);

  const remainingStorage = user.storageLimit - user.storageUsed;

  const usagePercentage =
    user.storageLimit === 0
      ? 0
      : Number(
          ((user.storageUsed / user.storageLimit) * 100).toFixed(2)
        );

  return {
    success: true,
    dashboard: {
      totalFiles,
      storageUsed: user.storageUsed,
      storageLimit: user.storageLimit,
      remainingStorage,
      usagePercentage,
      isVIP: user.isVIP,

      fileTypes: {
        pdf: pdfFiles,
        image: imageFiles,
        other: otherFiles,
      },

      recentFiles,
    },
  };
};

module.exports = {
  getDashboardData,
};