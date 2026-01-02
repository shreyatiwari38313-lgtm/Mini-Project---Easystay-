import { Router } from "express";
import {
  submitVerification,
  getVerificationStatus
} from "../controllers/hostVerification.controller.js";

const router = Router();

router.route("/").post(submitVerification);
router.route("/:hostId").get(getVerificationStatus);

export default router;
