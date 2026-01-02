import { Router } from "express";
import {
  createAvailability,
  getAvailabilityByProperty
} from "../controllers/availability.controller.js";

const router = Router();

router.route("/").post(createAvailability);
router.route("/:propertyId").get(getAvailabilityByProperty);

export default router;
