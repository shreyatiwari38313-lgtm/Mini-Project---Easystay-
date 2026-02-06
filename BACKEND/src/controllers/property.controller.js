import { Property } from "../models/Property.model.js";
import { uploadOnCloud } from "../utils/cloudinary.js";

/* =====================================
   CREATE PROPERTY (Cloudinary + Multer)
===================================== */
export const createProperty = async (req, res) => {
  try {
    let images = [];
    let { title, pricePerNight, propertyType, description } = req.body;
    
    // DEBUG: Log incoming files and body
    console.log("📸 req.files:", req.files ? `${req.files.length} files` : "undefined");
    console.log("📦 req.body keys:", Object.keys(req.body));
    if (req.files && req.files.length > 0) {
      console.log("📁 File details:", req.files.map(f => ({ name: f.originalname, path: f.path, size: f.size })));
    }
    
    // Parse address if it's a JSON string
    let address = req.body.address;
    if (typeof address === "string") {
      try {
        address = JSON.parse(address);
      } catch (e) {
        console.log("Address is not JSON, keeping as is");
      }
    }
    
    // Parse amenities if it's a JSON string
    let amenities = req.body.amenities || [];
    if (typeof amenities === "string" && amenities.trim()) {
      try {
        amenities = JSON.parse(amenities);
      } catch (e) {
        amenities = amenities.split(",").map(a => a.trim()).filter(Boolean);
      }
    }
    // If amenities is still a string (not an array), default to empty array
    if (typeof amenities === "string") {
      amenities = [];
    }
    // Ensure amenities is an array
    if (!Array.isArray(amenities)) {
      amenities = [];
    }
    
    const city = address?.city || req.body.city;

    if (!title || !city || !pricePerNight || !propertyType) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: title, city, pricePerNight, propertyType",
      });
    }

    // Handle uploaded files
    if (req.files && req.files.length > 0) {
      console.log("🖼️  Processing", req.files.length, "image files...");
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        try {
          console.log(`   [${i + 1}/${req.files.length}] Uploading: ${file.originalname}`);
          const uploaded = await uploadOnCloud(file.path);
          if (uploaded && uploaded.secure_url) {
            console.log(`   ✅ Image ${i + 1} uploaded to Cloudinary`);
            images.push({
              public_id: uploaded.public_id,
              url: uploaded.secure_url,
              isCover: i === 0, // First image as cover
            });
          } else {
            console.warn(`   ⚠️  Image ${i + 1} upload returned null or no URL`);
          }
        } catch (fileError) {
          console.error(`   ❌ Error uploading file ${i + 1}:`, fileError.message);
        }
      }
      console.log(`📦 Final images array has ${images.length} images`);
    } else {
      console.log("ℹ️  No image files provided in request");
    }

    // Normalize propertyType (frontend may send lowercase like 'apartment')
    const normalizedType =
      typeof propertyType === "string"
        ? propertyType.charAt(0).toUpperCase() + propertyType.slice(1).toLowerCase()
        : propertyType;

    // Ensure location coordinates exist (model requires coordinates)
    let location = req.body.location;
    if (!location) {
      const lon = req.body.longitude || req.body.lng || 0;
      const lat = req.body.latitude || req.body.lat || 0;
      location = { type: "Point", coordinates: [Number(lon) || 0, Number(lat) || 0] };
    }

    const propertyPayload = {
      ...req.body,
      images,
      hostId: req.user.id,
      propertyType: normalizedType,
      status: "pending",
      isActive: true,
      location,
      address,
      amenities,
    };

    const property = await Property.create(propertyPayload);

    res.status(201).json({
      success: true,
      message: "Property created successfully",
      property,
    });
  } catch (error) {
    console.error("Create property error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Error creating property" 
    });
  }
};

/* =====================================
   GET ALL PROPERTIES (Search / Filter / Sort)
===================================== */
export const getAllProperties = async (req, res) => {
  try {
    const {
      search,
      minPrice,
      maxPrice,
      type,
      sort,
      page = 1,
      limit = 10,
    } = req.query;

    let query = { isActive: true, status: "approved" };

    // Search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { "address.city": { $regex: search, $options: "i" } },
      ];
    }

    // Price filter
    if (minPrice || maxPrice) {
      query.pricePerNight = {};
      if (minPrice) query.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) query.pricePerNight.$lte = Number(maxPrice);
    }

    // Type filter (case-insensitive to accept frontend values like 'apartment')
    if (type) query.propertyType = { $regex: `^${type}$`, $options: "i" };

    // Sorting
    let sortOption = {};
    if (sort === "price") sortOption.pricePerNight = 1;
    if (sort === "-price") sortOption.pricePerNight = -1;
    if (sort === "latest") sortOption.createdAt = -1;
    if (sort === "rating") sortOption.averageRating = -1;

    const properties = await Property.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate("hostId", "name");

    res.status(200).json({
      success: true,
      count: properties.length,
      properties,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =====================================
   GET PROPERTY BY ID
===================================== */
export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate("hostId", "name email");

    if (!property || !property.isActive) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    res.status(200).json({ success: true, property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =====================================
   UPDATE PROPERTY (Replace Images)
===================================== */
export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    if (property.hostId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    // Upload new images if provided
    if (req.files && req.files.length > 0) {
      let newImages = [];

      for (const file of req.files) {
        const uploaded = await uploadOnCloud(file.path);

        if (uploaded) {
          newImages.push({
            public_id: uploaded.public_id,
            url: uploaded.secure_url,
          });
        }
      }

      property.images = newImages;
    }

    Object.assign(property, req.body);
    await property.save();

    res.status(200).json({
      success: true,
      message: "Property updated successfully",
      property,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =====================================
   SOFT DELETE PROPERTY
===================================== */
export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    if (property.hostId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    property.isActive = false;
    await property.save();

    res.status(200).json({
      success: true,
      message: "Property deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =====================================
   GET LOGGED-IN OWNER PROPERTIES
===================================== */
export const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ hostId: req.user.id })
      .populate("hostId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      properties,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =====================================
   ADMIN: APPROVE / REJECT PROPERTY
===================================== */
export const updatePropertyStatus = async (req, res) => {
  try {
    const { status } = req.body; // approved | rejected

    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Property ${status}`,
      property,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
