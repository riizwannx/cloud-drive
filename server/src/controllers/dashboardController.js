const dashboardService = require("../services/dashboardService");

const getDashboard = async (req, res) => {
  try {
    const result = await dashboardService.getDashboardData(req.user.id);

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

module.exports = {
  getDashboard,
};