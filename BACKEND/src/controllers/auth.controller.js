// src/controllers/auth.controller.js
import { User } from "../models/User.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

/**
 * REGISTER
 */
export const register = asyncHandler(async (req, res) => {
  console.log("Register endpoint hit with body:", req.body);
  
  const { name, email, password, role } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    return res.status(400).json({ 
      success: false,
      message: "Name, email, and password are required" 
    });
  }

  // Check if user already exists
  const exists = await User.findOne({ email });
  if (exists) {
    console.log("User already exists:", email);
    return res.status(409).json({ 
      success: false,
      message: "Email already registered" 
    });
  }

  try {
    // Create user with role (defaults to 'guest' if not provided)
    const user = await User.create({
      name,
      email,
      password,
      role: role || "guest",
    });
    
    console.log("User created successfully:", user._id);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error registering user"
    });
  }
});

/**
 * LOGIN
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  res.json({
    success: true,
    message: "Login successful",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  });
});

/**
 * REFRESH TOKEN
 */
export const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token required" });
  }

  const decoded = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  const user = await User.findById(decoded._id);
  if (!user) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }

  const newAccessToken = user.generateAccessToken();

  res.json({ accessToken: newAccessToken });
});

/**
 * LOGOUT
 */
export const logout = asyncHandler(async (req, res) => {
  // logic to clear refresh token / cookies if you use them
  res.status(200).json({ message: "Logged out successfully" });
});
