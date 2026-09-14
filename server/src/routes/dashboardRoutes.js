const express = require("express");
const router = express.Router();
const { rateLimit, ipKeyGenerator } = require("express-rate-limit");

const { getDashboard } = require("../controllers/dashboardController");
const authMiddleware = require("../middleware/authMiddleware");

// Rate Limiter: Dashboard aggregation abuse protection (100 requests per 15 minutes per user)
const dashboardLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: false,
  legacyHeaders: false,
  keyGenerator: (req) => {
    if (req.user?.id) {
      return `dashboard-user:${req.user.id}`;
    }
    return `dashboard-ip:${ipKeyGenerator(req.ip || "127.0.0.1")}`;
  },
  validate: {
    xForwardedForHeader: false,
    default: true,
  },
  message: {
    success: false,
    message: "Too many dashboard requests. Please try again later.",
  },
});

// Get Dashboard
router.get("/", authMiddleware, dashboardLimiter, getDashboard);

module.exports = router;