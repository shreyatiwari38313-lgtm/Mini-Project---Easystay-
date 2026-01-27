// src/controllers/user.controller.js
import { User } from "../models/User.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * GET PROFILE
 */
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json({
    success: true,
    message: "Profile retrieved successfully",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      profileImage: user.profileImage,
    }
  });
});

/**
 * UPDATE PROFILE
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const { name, email, password, phone } = req.body;
  if (name) user.name = name;
  if (email) user.email = email;
  if (password) user.password = password; // hashed via pre-save hook
  if (phone) user.phone = phone;

  await user.save();

  // Return updated user without password
  const { password: _, ...userData } = user.toObject();
  res.json({ user: userData });
});

/**
 * DELETE USER
 */
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  await User.findByIdAndDelete(req.user._id);
  res.json({ message: "User deleted successfully" });
});
