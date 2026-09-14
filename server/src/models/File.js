const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    originalName: {
      type: String,
      required: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    filePath: {
      type: String,
      required: true,
    },

    fileType: {
      type: String,
      required: true,
    },

    fileSize: {
      type: Number,
      required: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    folder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      default: null,
    },

    isFavorite: {
      type: Boolean,
      default: false,
    },

    isTrashed: {
      type: Boolean,
      default: false,
    },

    isShared: {
      type: Boolean,
      default: false,
    },

    shareToken: {
      type: String,
      default: null,
    },

    trashedAt: {
      type: Date,
      default: null,
    },

    cloudinaryPublicId: {
      type: String,
      default: null,
    },

    cloudinaryUrl: {
      type: String,
      default: null,
    },

    cloudinaryResourceType: {
      type: String,
      default: null,
    },

    cloudinaryType: {
      type: String,
      enum: ["upload", "authenticated", "private", null],
      default: "authenticated",
    },
  },
  
  {
    timestamps: true,
  }
);

// Compound index for tenant file queries and folder browsing with creation date ordering
fileSchema.index({ owner: 1, isTrashed: 1, folder: 1, createdAt: -1 });

// Index for tenant favorite file listing
fileSchema.index({ owner: 1, isFavorite: 1, isTrashed: 1, createdAt: -1 });

// Sparse index for shared file token lookups (avoids indexing null values)
fileSchema.index({ shareToken: 1 }, { sparse: true });

// Sparse index for Cloudinary asset lookups and cleanup
fileSchema.index({ cloudinaryPublicId: 1 }, { sparse: true });

module.exports = mongoose.model("File", fileSchema);