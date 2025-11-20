const User = require('../models/user.model')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Create JWT Token
// const sendToken = (user, res) => {
//   const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRE,
//   });

//   // Send cookie
//   res.cookie("token", token, {
//     httpOnly: true,
//     expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
//   });

//   res.status(200).json({
//     success: true,
//     token,
//     user: { id: user._id, name: user.name, email: user.email },
//   });
// };

const sendToken = (user, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
  });

  res.status(200).json({
    success: true,
    token,
    user: { 
      id: user._id, 
      name: user.name, 
      email: user.email,
      role: user.role    // <-- FIX HERE
    }
  });
};

// Signup
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "User already exists" });

    user = await User.create({ name, email, password });
    sendToken(user, res);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "Invalid Email or Password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid Email or Password" });

    sendToken(user, res);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Read secret from header
    const clientSecret = req.headers["x-admin-secret"];
    const serverSecret = process.env.ADMIN_SECRET_KEY;

    console.log("Client Sent:", clientSecret);
    console.log("Server Expected:", serverSecret);

    // Validate secret key
    if (!clientSecret || clientSecret !== serverSecret) {
        return res.status(403).json({ message: "Invalid Admin Secret Key" });
    }

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    user = await User.create({
      name,
      email,
      password,
      role: "admin"
    });

    sendToken(user, res);

  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


// Login Admin
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 1. Find User
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // 2. Check Role (CRITICAL STEP)
    if (user.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Not an authorized Admin." });
    }

    // 3. Check Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    sendToken(user, res);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
// Logout
exports.logoutUser = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  return res.status(200).json({ success: true, message: "Logged out" });
};
