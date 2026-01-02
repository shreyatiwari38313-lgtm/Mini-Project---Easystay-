import Availability from "../models/Availability.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createAvailability = asyncHandler(async (req, res) => {
  const availability = await Availability.create(req.body);
  res.status(201).json(availability);
});

const getAvailabilityByProperty = asyncHandler(async (req, res) => {
  const availability = await Availability.find({
    propertyId: req.params.propertyId
  });

  res.status(200).json(availability);
});

export { createAvailability, getAvailabilityByProperty };
