import { Router } from "express";
import express from "express";
// import both protect and isAdmin from your middlewares folder
import { protect, isAdmin } from "../middlewares/auth.middleware.js";
// ensure controller exports include getBookingById
import {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,           // now used by routes below
  deleteBooking,
  cancelBooking,
  updateBookingStatus,
  getAllBookings,
} from "../controllers/booking.controller.js";

const router = express.Router();

// ensure no local 'updateBooking' declaration exists in this file

/* ================================
   USER ROUTES
================================ */

// Create booking
router.post("/", protect, createBooking);

// Get logged-in user bookings
router.get("/my/bookings", protect, getBookings);

// Cancel booking
router.patch("/:id/cancel", protect, cancelBooking);

// Get booking by ID
router.get("/:id", protect, getBookingById);

// Update booking (full or partial) — uses imported updateBooking
router.put("/:id", protect, updateBooking);
router.patch("/:id", protect, updateBooking);

// Update booking status
router.patch("/:id/status", protect, isAdmin, updateBookingStatus);

// Delete booking
router.delete("/:id", protect, isAdmin, deleteBooking);

/* ================================
   ADMIN ROUTES
================================ */

// Get all bookings
router.get("/admin/all", protect, isAdmin, getAllBookings);

export default router;
