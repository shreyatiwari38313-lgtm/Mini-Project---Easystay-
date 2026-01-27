import Wishlist from "../models/Wishlist.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addToWishlist = asyncHandler(async (req, res) => {
  const { userId, propertyId } = req.body;

  const wishlist = await Wishlist.findOneAndUpdate(
    { userId },
    { $addToSet: { properties: propertyId } },
    { new: true, upsert: true }
  );

  res.status(200).json(wishlist);
});

const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ userId: req.params.userId });
  res.status(200).json(wishlist);
});

export { addToWishlist, getWishlist };
