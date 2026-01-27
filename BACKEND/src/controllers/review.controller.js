import Review from "../models/Review.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createReview = asyncHandler(async (req, res) => {
  const review = await Review.create(req.body);
  res.status(201).json(review);
});

const getReviewsByProperty = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ propertyId: req.params.propertyId });
  res.status(200).json(reviews);
});

export { createReview, getReviewsByProperty };
