const favoriteService = require("../services/favoriteService");

const toggleFavorite = async (req, res) => {
  try {
    const result = await favoriteService.toggleFavorite(
      req.params.id,
      req.user.id
    );

    if (!result.success) {
      return res.status(result.status).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getFavoriteFiles = async (req, res) => {
  try {
    const result = await favoriteService.getFavoriteFiles(req.user.id);

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  toggleFavorite,
  getFavoriteFiles,
};