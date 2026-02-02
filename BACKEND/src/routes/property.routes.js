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

// Get single property
router.route("/:id")
  .get(getPropertyById);

/* ================================
   OWNER ROUTES
================================ */

// Create property (with images)
router.route("/")
  .post(
    protect,
    upload.array("images", 5),
    createProperty
  );

// Update property (with image replace)
router.route("/:id")
  .put(
    protect,
    upload.array("images", 5),
    updateProperty
  );

// Soft delete property
router.route("/:id")
  .delete(
    protect,
    deleteProperty
  );

// Get logged-in owner's properties
router.route("/my/properties")
  .get(
    protect,
    getMyProperties
  );

/* ================================
   ADMIN ROUTES
================================ */

// Approve / Reject property
router.route("/admin/:id/status")
  .patch(
    protect,
    isAdmin,
    updatePropertyStatus
  );

/* ================================
   default EXPORT
================================ */
export default router;;
