const {
  createFolder,
  getFolders,
  getFolder,
  renameFolder,
  deleteFolder,
} = require("../services/folderService");

// ==============================
// Create Folder
// ==============================
const createNewFolder = async (req, res) => {
  try {
    console.log("========== CREATE FOLDER ==========");
    console.log("User:", req.user);
    console.log("Body:", req.body);

    const { name, parentFolder } = req.body;

    const result = await createFolder(
      name,
      req.user.id,
      parentFolder || null
    );

    console.log("Result:", result);

    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Create Folder Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

// ==============================
// Get All Folders
// ==============================
const getAllFolders = async (req, res) => {
  try {
    const result = await getFolders(req.user.id);

    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Get Folders Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

// ==============================
// Get Single Folder
// ==============================
const getFolderById = async (req, res) => {
  try {
    const result = await getFolder(
      req.params.id,
      req.user.id
    );

    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Get Folder Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

// ==============================
// Rename Folder
// ==============================
const updateFolder = async (req, res) => {
  try {
    const { name } = req.body;

    const result = await renameFolder(
      req.params.id,
      req.user.id,
      name
    );

    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Rename Folder Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

// ==============================
// Delete Folder
// ==============================
const removeFolder = async (req, res) => {
  try {
    const result = await deleteFolder(
      req.params.id,
      req.user.id
    );

    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Delete Folder Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

module.exports = {
  createNewFolder,
  getAllFolders,
  getFolderById,
  updateFolder,
  removeFolder,
};