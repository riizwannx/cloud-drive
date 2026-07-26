const crypto = require("crypto");
const bcrypt = require("bcryptjs");

// =====================================
// Generate Secure Share Token
// =====================================
const generateShareToken = () => {
  return crypto.randomBytes(24).toString("hex");
};

// =====================================
// Hash Password
// =====================================
const hashPassword = async (password) => {
  if (!password) return null;

  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// =====================================
// Compare Password
// =====================================
const comparePassword = async (password, hashedPassword) => {
  if (!hashedPassword) return true;

  return bcrypt.compare(password, hashedPassword);
};

// =====================================
// Check Expiration
// =====================================
const isExpired = (expiresAt) => {
  if (!expiresAt) return false;

  return new Date() > new Date(expiresAt);
};

module.exports = {
  generateShareToken,
  hashPassword,
  comparePassword,
  isExpired,
};