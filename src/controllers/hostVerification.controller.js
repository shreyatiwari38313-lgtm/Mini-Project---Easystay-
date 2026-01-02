import HostVerification from "../models/HostVerification.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const submitVerification = asyncHandler(async (req, res) => {
  const verification = await HostVerification.create(req.body);
  res.status(201).json(verification);
});

const getVerificationStatus = asyncHandler(async (req, res) => {
  const verification = await HostVerification.findOne({
    hostId: req.params.hostId
  });

  res.status(200).json(verification);
});

export { submitVerification, getVerificationStatus };
