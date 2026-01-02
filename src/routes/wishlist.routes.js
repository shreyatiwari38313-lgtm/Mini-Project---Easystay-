import { Router } from "express";
import {
  addToWishlist,
  getWishlist
} from "../controllers/wishlist.controller.js";

const router = Router();

router.route("/").post(addToWishlist);
router.route("/:userId").get(getWishlist);

export default router;
