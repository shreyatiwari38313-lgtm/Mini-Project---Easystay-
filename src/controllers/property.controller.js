import Property from "../models/Property.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createProperty = asyncHandler(async (req, res) => {
  const property = await Property.create(req.body);

  res.status(201).json(property);
});

const getAllProperties = asyncHandler(async (req, res) => {
  const properties = await Property.find();
  res.status(200).json(properties);
});

const getPropertyById = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  res.status(200).json(property);
});

export { createProperty, getAllProperties, getPropertyById };
