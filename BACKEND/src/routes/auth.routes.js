import express from "express";
// ✅ Import named exports only from user model/controller
import { register, login, refresh, logout } from "../controllers/auth.controller.js";
import { registerValidation, loginValidation } from "../validations/auth.users.js";
import { validationResult } from "express-validator";

const router = express.Router();

// Log incoming requests
router.use((req, res, next) => {
  console.log(`📨 [${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  next();
};

router.post(
  "/register",
  registerValidation,
  validate,
  register
);

router.post(
  "/login",
  loginValidation,
  validate,
  login
);

router.post("/refresh", refresh);
router.post("/logout", logout);

export default router;
