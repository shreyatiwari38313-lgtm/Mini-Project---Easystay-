import Booking from "../models/Booking.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.create(req.body);
  res.status(201).json(booking);
});

const getUserBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ guestId: req.params.userId });
  res.status(200).json(bookings);
});

export { createBooking, getUserBookings };
