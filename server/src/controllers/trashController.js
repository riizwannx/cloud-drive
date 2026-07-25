const {
  moveToTrash,
  getTrashedFiles,
  restoreFile,
  permanentlyDeleteFile,
} = require("../services/trashService");

// Move file to Trash
const moveFileToTrash = async (req, res) => {
  try {
    const result = await moveToTrash(req.params.id, req.user.id);

    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Move to Trash Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

// Get all trashed files
const getTrash = async (req, res) => {
  try {
    const result = await getTrashedFiles(req.user.id);

    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Get Trash Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

// Restore file
const restoreTrashFile = async (req, res) => {
  try {
    const result = await restoreFile(req.params.id, req.user.id);

    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Restore File Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

// Permanently delete file
const deleteTrashFile = async (req, res) => {
  try {
    const result = await permanentlyDeleteFile(req.params.id, req.user.id);

    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Permanent Delete Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

module.exports = {
  moveFileToTrash,
  getTrash,
  restoreTrashFile,
  deleteTrashFile,
};