import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    priceOverride: {
      type: Number
    }
  },
  { timestamps: true }
);

// Prevent duplicate date entries for same property
availabilitySchema.index({ propertyId: 1, date: 1 }, { unique: true });

export default mongoose.model("Availability", availabilitySchema);
