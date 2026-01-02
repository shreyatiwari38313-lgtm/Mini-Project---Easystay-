import { Router } from "express";
import {
  createProperty,
  getAllProperties,
  getPropertyById
} from "../controllers/property.controller.js";

const router = Router();

router.route("/").post(createProperty);
router.route("/").get(getAllProperties);
router.route("/:id").get(getPropertyById);

export default router;
