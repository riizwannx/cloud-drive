const User = require("../models/User");

/**
 * Check if user has enough storage available
 */
const checkStorageLimit = async (userId, fileSize) => {
  const user = await User.findById(userId);

  if (!user) {
    return {
      success: false,
      status: 404,
      message: "User not found.",
    };
  }

  const remainingStorage = user.storageLimit - user.storageUsed;

  if (fileSize > remainingStorage) {
    return {
      success: false,
      status: 403,
      message:
        "Storage limit exceeded. Please delete some files or upgrade your plan.",
    };
  }

  return {
    success: true,
    user,
  };
};

/**
 * Increase user's used storage
 */
const increaseStorage = async (userId, fileSize) => {
  await User.findByIdAndUpdate(userId, {
    $inc: {
      storageUsed: fileSize,
    },
  });
};

/**
 * Decrease user's used storage
 */
const decreaseStorage = async (userId, fileSize) => {
  await User.findByIdAndUpdate(userId, {
    $inc: {
      storageUsed: -fileSize,
    },
  });
};

/**
 * Get user's storage information
 */
const getStorageInfo = async (userId) => {
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

  return {
    success: true,
    storage: {
      storageUsed: user.storageUsed,
      storageLimit: user.storageLimit,
      remainingStorage: user.storageLimit - user.storageUsed,
      isVIP: user.isVIP,
    },
  };
};

module.exports = {
  checkStorageLimit,
  increaseStorage,
  decreaseStorage,
  getStorageInfo,
};