import mongoose from "mongoose";

const hostVerificationSchema = new mongoose.Schema(
  {
    hostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    documentType: {
      type: String,
      enum: ["Aadhar", "Passport", "Driving License"],
      required: true
    },
    documentNumber: {
      type: String,
      required: true
    },
    documentImageUrl: {
      type: String,
      required: true
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },
    verifiedAt: {
      type: Date
    }
  },
  { timestamps: true }
);

export default mongoose.model("HostVerification", hostVerificationSchema);
