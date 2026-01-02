import { Router } from "express";
import {
  createReview,
  getReviewsByProperty
} from "../controllers/review.controller.js";

const router = Router();

router.route("/").post(createReview);
router.route("/:propertyId").get(getReviewsByProperty);

export default router;
