
import Amenity from "../models/Amenity.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createAmenity = asyncHandler(async (req, res) => {
  const amenity = await Amenity.create(req.body);
  res.status(201).json(amenity);
});

const getAmenities = asyncHandler(async (req, res) => {
  const amenities = await Amenity.find();
  res.status(200).json(amenities);
});

export { createAmenity, getAmenities };
