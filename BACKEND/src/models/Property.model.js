import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    hostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    propertyType: {
      type: String,
      enum: ["Apartment", "House", "Villa", "Studio", "Hotel"],
      required: true
    },

    pricePerNight: {
      type: Number,
      required: true
    },

    maxGuests: {
      type: Number,
      required: true
    },

    bedrooms: {
      type: Number,
      default: 1
    },

    bathrooms: {
      type: Number,
      default: 1
    },

    address: {
      street: { type: String },
      city: { type: String, required: true },
      state: { type: String },
      country: { type: String, required: true },
      zipCode: { type: String }
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      }
    },

    amenities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Amenity"
      }
    ],

    images: [
      {
        url: { type: String, required: true },
        isCover: { type: Boolean, default: false }
      }
    ],

    isActive: {
      type: Boolean,
      default: true
    },

    averageRating: {
      type: Number,
      default: 0
    },

    totalReviews: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

// Geo-spatial index for location-based search
propertySchema.index({ location: "2dsphere" });

export default mongoose.model("Property", propertySchema);
