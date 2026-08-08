const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getProfile,
  changePassword,
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");

// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected Route
router.get("/profile", authMiddleware, getProfile);

// Change Password
router.patch(
  "/change-password",
  authMiddleware,
  changePassword
);

module.exports = router;