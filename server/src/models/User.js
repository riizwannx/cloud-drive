const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    profilePicture: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },

    storageUsed: {
      type: Number,
      default: 0,
    },

    storageLimit: {
      type: Number,
      default: 5 * 1024 * 1024 * 1024, // 5 GB
    },

    isVIP: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);