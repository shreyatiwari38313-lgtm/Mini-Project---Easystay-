import Payment from "../models/Payment.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPayment = asyncHandler(async (req, res) => {
  const payment = await Payment.create(req.body);
  res.status(201).json(payment);
});

export { createPayment };
