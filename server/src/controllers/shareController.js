const Share = require("../models/Share");
const File = require("../models/File");
const shareService = require("../services/shareService");
const path = require("path");
const fs = require("fs");

// =====================================
// Share File
// =====================================
const shareFile = async (req, res) => {

  try {
    const { id } = req.params;
    const { password, expiresAt } = req.body || {};
 
    const file = await File.findOne({
      _id: id,
      owner: req.user.id,
      isTrashed: false,
    });


    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found.",
      });
    }


    const existingShare = await Share.findOne({
      file: file._id,
      owner: req.user.id,
      isActive: true,
    });

    if (existingShare) {
      return res.status(400).json({
        success: false,
        message: "File is already shared.",
      });
    }

    const shareToken = shareService.generateShareToken();

    const hashedPassword = await shareService.hashPassword(password);

    const share = await Share.create({
      file: file._id,
      owner: req.user.id,
      shareToken,
      password: hashedPassword,
      expiresAt: expiresAt || null,
    });

    return res.status(201).json({
      success: true,
      message: "File shared successfully.",
      shareLink: `${req.protocol}://${req.get("host")}/api/share/${shareToken}`,
      share,
    });

  } catch (error) {
    console.error("========== SHARE ERROR ==========");
    console.error(error);

  return res.status(500).json({
    success: false,
    message: error.message,
    stack: error.stack,
  });
 }
};

// =====================================
// Get My Shared Files
// =====================================
const getSharedFiles = async (req, res) => {
  try {

    const shares = await Share.find({
      owner: req.user.id,
      isActive: true,
    })
      .populate("file", "originalName fileSize")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: shares.length,
      shares,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =====================================
// Revoke Share
// =====================================
const revokeShare = async (req, res) => {
  try {

    const { id } = req.params;

    const share = await Share.findOne({
      _id: id,
      owner: req.user.id,
      isActive: true,
    });

    if (!share) {
      return res.status(404).json({
        success: false,
        message: "Shared link not found.",
      });
    }

    share.isActive = false;

    await share.save();

    return res.status(200).json({
      success: true,
      message: "Shared link revoked successfully.",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =====================================
// Download Shared File
// =====================================
const downloadSharedFile = async (req, res) => {
  try {
    const { token } = req.params;

    // Find active share
    const share = await Share.findOne({
      shareToken: token,
      isActive: true,
    });

    if (!share) {
      return res.status(404).json({
        success: false,
        message: "Invalid share link.",
      });
    }

    // Check expiry
    if (shareService.isExpired(share.expiresAt)) {
      return res.status(400).json({
        success: false,
        message: "Share link has expired.",
      });
    }

    // Find file
    const file = await File.findById(share.file);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found.",
      });
    }

    // Check file exists on disk
    if (!fs.existsSync(file.filePath)) {
      return res.status(404).json({
        success: false,
        message: "File is missing from storage.",
      });
    }

    // Increase download count
    share.downloadCount += 1;
    await share.save();

    // Download
    return res.download(
      path.resolve(file.filePath),
      file.originalName
    );

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  shareFile,
  getSharedFiles,
  revokeShare,
  downloadSharedFile,
};