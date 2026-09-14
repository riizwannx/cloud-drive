const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ==============================
// Register User
// ==============================
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

const registerUser = async (req, res) => {
  try {
    const { username, email, password, phone, bio } = req.body || {};

    // Validate required fields and types
    if (
      typeof username !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Username, email, and password are required.",
      });
    }

    const cleanUsername = username.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanUsername || !cleanEmail || !cleanPassword) {
      return res.status(400).json({
        success: false,
        message: "Username, email, and password are required.",
      });
    }

    // Validate email format and RFC length
    if (!EMAIL_REGEX.test(cleanEmail) || cleanEmail.length > 254) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format.",
      });
    }

    // Validate username length
    if (cleanUsername.length > 50) {
      return res.status(400).json({
        success: false,
        message: "Username must not exceed 50 characters.",
      });
    }

    // Validate password length constraints
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    if (password.length > 128) {
      return res.status(400).json({
        success: false,
        message: "Password must not exceed 128 characters.",
      });
    }

        // Check if username or email already exists
    const existingUser = await User.findOne({
      $or: [{ username: cleanUsername }, { email: cleanEmail }],
    });

    if (existingUser) {
      if (existingUser.username === cleanUsername) {
        return res.status(409).json({
          success: false,
          message: "Username is already in use.",
        });
      }
      return res.status(409).json({
        success: false,
        message: "Email is already registered. Please log in.",
      });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Sanitize optional profile fields
    const cleanPhone = typeof phone === "string" ? phone.trim().slice(0, 30) : "";
    const cleanBio = typeof bio === "string" ? bio.trim().slice(0, 300) : "";

    // Create new user
    const newUser = new User({
      username: cleanUsername,
      email: cleanEmail,
      password: hashedPassword,
      phone: cleanPhone,
      bio: cleanBio,
      tokenVersion: 0,
    });

    // Save user
    await newUser.save();

    // Fetch user without password, tokenVersion, and __v
    const user = await User.findById(newUser._id).select("-password -tokenVersion -__v");

    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      user,
    });
  } catch (error) {
    // Handle MongoDB duplicate key collision safely without exposing internal details
    if (error && error.code === 11000) {
      const keyPattern = error.keyPattern || {};
      if (keyPattern.username) {
        return res.status(409).json({
          success: false,
          message: "Username is already in use.",
        });
      }
      if (keyPattern.email) {
        return res.status(409).json({
          success: false,
          message: "Email is already registered. Please log in.",
        });
      }
      return res.status(409).json({
        success: false,
        message: "An account with these details already exists.",
      });
    }

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ============================== 
// Login User
// ============================== 
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    // Validate fields and types
    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // Validate email format and input length limits
    if (!EMAIL_REGEX.test(cleanEmail) || cleanEmail.length > 254) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format.",
      });
    }

    if (password.length > 128) {
      return res.status(400).json({
        success: false,
        message: "Password must not exceed 128 characters.",
      });
    }

    // Find user with password explicitly selected
    const user = await User.findOne({ email: cleanEmail }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Ensure JWT_SECRET is configured
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET environment variable is missing.");
      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }

    // Generate JWT Token with explicitly pinned algorithm and minimal payload
    const token = jwt.sign(
      {
        id: user._id.toString(),
        tokenVersion: user.tokenVersion || 0,
      },
      process.env.JWT_SECRET,
      {
        algorithm: "HS256",
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ============================== 
// Get Current Logged-in User
// ============================== 
const getProfile = async (req, res) => {
  try {
    // Find logged-in user from MongoDB without password, tokenVersion, and __v
    const user = await User.findById(req.user.id).select("-password -tokenVersion -__v");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile fetched successfully.",
      user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
// ==============================
// Change Password
// ==============================
const changePassword = async (req, res) => {
  try {
    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = req.body || {};

    // Validate required fields and types
    if (
      typeof currentPassword !== "string" ||
      typeof newPassword !== "string" ||
      typeof confirmPassword !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "All password fields are required.",
      });
    }

    if (
      !currentPassword.trim() ||
      !newPassword.trim() ||
      !confirmPassword.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "All password fields are required.",
      });
    }

    // Check new password confirmation
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New passwords do not match.",
      });
    }

    // Minimum password length
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long.",
      });
    }

    // Maximum password length constraint
    if (
      currentPassword.length > 128 ||
      newPassword.length > 128 ||
      confirmPassword.length > 128
    ) {
      return res.status(400).json({
        success: false,
        message: "Password must not exceed 128 characters.",
      });
    }

    // Find current user with password explicitly selected
    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    // Prevent using the same password
    const isSamePassword = await bcrypt.compare(
      newPassword,
      user.password
    );

    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from your current password.",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    // Update password and revoke previously issued JWTs atomically
    user.password = hashedPassword;
    user.tokenVersion = (user.tokenVersion || 0) + 1;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.error("Change Password Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ============================== 
// Logout User (Revoke Tokens)
// ============================== 
const logout = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $inc: { tokenVersion: 1 } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Logout successful.",
    });
  } catch (error) {
    console.error("Logout Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ============================== 
// Export Controllers
// ============================== 
module.exports = {
  registerUser,
  loginUser,
  getProfile,
  changePassword,
  logout,
};
