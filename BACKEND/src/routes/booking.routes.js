import { Router } from "express";
import {
  createBooking,
  getUserBookings
} from "../controllers/booking.controller.js";

const router = Router();

router.route("/").post(createBooking);
router.route("/user/:userId").get(getUserBookings);

export default router;
