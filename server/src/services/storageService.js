const mongoose = require("mongoose");
const User = require("../models/User");

/**
 * Atomically reserve storage for a user if within storage limit
 */
const reserveStorage = async (userId, fileSize) => {
  if (typeof fileSize !== "number" || Number.isNaN(fileSize) || fileSize < 0) {
    return {
      success: false,
      status: 400,
      message: "Invalid file size.",
    };
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return {
      success: false,
      status: 404,
      message: "User not found.",
    };
  }

  const user = await User.findOneAndUpdate(
    {
      _id: userId,
      $expr: {
        $lte: [
          { $add: [{ $ifNull: ["$storageUsed", 0] }, fileSize] },
          { $ifNull: ["$storageLimit", 5 * 1024 * 1024 * 1024] },
        ],
      },
    },
    {
      $inc: {
        storageUsed: fileSize,
      },
    },
    {
      returnDocument: "after",
    }
  );

  if (!user) {
    const existingUser = await User.findById(userId);

    if (!existingUser) {
      return {
        success: false,
        status: 404,
        message: "User not found.",
      };
    }

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
  reserveStorage,
  increaseStorage,
  decreaseStorage,
  getStorageInfo,
};
