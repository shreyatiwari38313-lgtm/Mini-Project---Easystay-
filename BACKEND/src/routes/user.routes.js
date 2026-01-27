import express from "express";
import { getProfile, updateProfile, deleteUser } from "../controllers/user.controller.js";
import protect from "../middlewares/auth.middleware.js";

const router = express.Router();

// All routes are protected
router.get("/me", protect, getProfile);
router.put("/update", protect, updateProfile);
router.delete("/delete", protect, deleteUser);

export default router;
