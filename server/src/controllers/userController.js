const User = require("../models/User");

const createUser = async (req, res) => {
  try {
    const user = new User({
      username: "riizwannx",
      email: "riizwannx@gmail.com",
      password: "12345678",
      phone: "9876543210",
      bio: "CloudDrive Developer",
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createUser,
};