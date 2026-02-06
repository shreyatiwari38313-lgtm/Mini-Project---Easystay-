import { Router } from "express";
import {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  getMyProperties,
  updatePropertyStatus,
} from "../controllers/property.controller.js";

import { upload } from "../middlewares/multer.middleware.js";
import { protect , isAdmin} from "../middlewares/auth.middleware.js";

const router = Router();

/* ================================
   PUBLIC ROUTES
================================ */

// Get all approved properties
router.route("/")
  .get(getAllProperties);
// Owner & Admin specific routes (must come before "/:id" to avoid conflicts)

// Get logged-in owner's properties
router.get("/my/properties", protect, getMyProperties);

// Admin: Approve / Reject property
router.route("/admin/:id/status")
  .patch(
    protect,
    isAdmin,
    updatePropertyStatus
  );

/* ================================
   OWNER ROUTES
================================ */

// Middleware to handle file uploads with error fallback
const handleUpload = upload.array("images", 5);
const safeUpload = (req, res, next) => {
  console.log("🔧 [MULTER] safeUpload middleware triggered");
  console.log("   Content-Type:", req.headers["content-type"]);
  handleUpload(req, res, (err) => {
    if (err) {
      console.error("⚠️  [MULTER] Error caught:", err.message);
      // If multer fails (e.g., no files or wrong content-type), just continue
      // The controller will handle it
      next();
    } else {
      console.log("✅ [MULTER] Files processed successfully");
      console.log("   req.files:", req.files ? `${req.files.length} files` : "undefined");
      next();
    }
  });
};

// Create property
router.post(
  "/",
  protect,
  safeUpload,
  createProperty
);

/* ================================
   PUBLIC SINGLE/ID ROUTES
================================ */

// Get single property
router.route("/:id")
  .get(getPropertyById)
  .put(
    protect,
    safeUpload,
    updateProperty
  )
  .delete(
    protect,
    deleteProperty
  );

/* ================================
   default EXPORT
================================ */
export default router;

