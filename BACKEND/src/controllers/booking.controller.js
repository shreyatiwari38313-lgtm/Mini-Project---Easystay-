import  Booking  from "../models/Booking.model.js";
import { Property } from "../models/Property.model.js";

/* =====================================
   CREATE BOOKING
===================================== */
export const createBooking = async (req, res) => {
  try {
    const { propertyId, checkIn, checkOut, guests } = req.body;

    if (!propertyId || !checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: propertyId, checkIn, checkOut",
      });
    }

    const property = await Property.findById(propertyId);

    if (!property || !property.isActive || property.status !== "approved") {
      return res.status(404).json({
        success: false,
        message: "Property not available for booking",
      });
    }

    // Check date overlap
    const existingBooking = await Booking.findOne({
      propertyId,
      status: { $in: ["confirmed", "pending"] },
      $or: [
        {
          checkIn: { $lt: new Date(checkOut) },
          checkOut: { $gt: new Date(checkIn) },
        },
      ],
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: "Property already booked for selected dates",
      });
    }

    // Price calculation
    const days =
      (new Date(checkOut) - new Date(checkIn)) /
      (1000 * 60 * 60 * 24);

    const totalPrice = days * property.pricePerNight;

    const booking = await Booking.create({
      userId: req.user.id,
      propertyId,
      checkIn,
      checkOut,
      guests,
      totalPrice,
      status: "confirmed",
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* =====================================
   GET MY BOOKINGS (USER)
===================================== */
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate("propertyId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* =====================================
   GET BOOKING BY ID
===================================== */
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("propertyId")
      .populate("userId", "name email");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* =====================================
   CANCEL BOOKING
===================================== */
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // only owner or admin can cancel
    if (req.user?.role !== "admin" && booking.user?.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // update status (change value if frontend expects different token)
    booking.status = "cancelled";
    booking.cancelledAt = new Date();

    const updated = await booking.save();
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
};


/* =====================================
   ADMIN: GET ALL BOOKINGS
===================================== */
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "name email")
      .populate("propertyId", "title");

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================
   GET BOOKINGS (USER)
===================================== */
export const getBookings = async (req, res) => {
  try {
    // Admin gets all bookings; regular users get only their own
    const filter = req.user?.role === "admin" ? {} : { user: req.user.id };
    const bookings = await Booking.find(filter).sort({ createdAt: -1 });
    return res.json(bookings);
  } catch (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

/* =====================================
   DELETE BOOKING
===================================== */
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // allow owner or admin to delete
    if (req.user?.role !== "admin" && booking.user?.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await Booking.findByIdAndDelete(id);
    return res.status(200).json({ message: "Booking deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

/* =====================================
   UPDATE BOOKING
===================================== */
export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // allow owner or admin to update
    if (req.user?.role !== "admin" && booking.user?.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // merge allowed fields from req.body (adjust allowedFields as needed)
    const allowedFields = ["startDate", "endDate", "status", "guests", "notes"];
    allowedFields.forEach((f) => {
      if (req.body[f] !== undefined) booking[f] = req.body[f];
    });

    const updated = await booking.save();
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

/* =====================================
   admin-only: change booking status (validate allowed values)
===================================== */
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: "Status is required" });

    const allowed = ["pending", "confirmed", "checked_in", "completed", "cancelled"];
    if (!allowed.includes(status)) return res.status(400).json({ message: "Invalid status" });

    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = status;
    if (status === "cancelled") booking.cancelledAt = new Date();

    const updated = await booking.save();
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
};
