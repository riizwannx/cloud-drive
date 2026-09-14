const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    parentFolder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for multi-tenant parent-folder listing, child lookups, and duplicate name checks
folderSchema.index({ owner: 1, parentFolder: 1, name: 1 });

module.exports = mongoose.model("Folder", folderSchema);