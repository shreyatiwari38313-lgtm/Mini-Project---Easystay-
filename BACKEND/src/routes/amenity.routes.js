import { Router } from "express";
import {
  createAmenity,
  getAmenities
} from "../controllers/amenity.controller.js";

const router = Router();

router.route("/").post(createAmenity);
router.route("/").get(getAmenities);

export default router;