const express = require("express");
const router = express.Router();
const { rateLimit, ipKeyGenerator } = require("express-rate-limit");

const {
  registerUser,
  loginUser,
  getProfile,
  changePassword,
  logout,
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");

// Rate Limiter: Dedicated change-password failure protection (5 failed attempts per 15 minutes)
const changePasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  standardHeaders: false,
  legacyHeaders: false,
  keyGenerator: (req) => {
    if (req.user?.id) {
      return `change-password-user:${req.user.id}`;
    }
    return `change-password-ip:${ipKeyGenerator(req.ip || "127.0.0.1")}`;
  },
  validate: {
    xForwardedForHeader: false,
    default: true,
  },
  message: {
    success: false,
    message: "Too many password change attempts. Please try again later.",
  },
});

// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected Routes
router.post("/logout", authMiddleware, logout);
router.get("/profile", authMiddleware, getProfile);

// Change Password
router.patch(
  "/change-password",
  authMiddleware,
  changePasswordLimiter,
  changePassword
);

module.exports = router;
