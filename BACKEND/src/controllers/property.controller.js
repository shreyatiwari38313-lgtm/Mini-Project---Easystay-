import { Property } from "../models/Property.model.js";
import { uploadOnCloud } from "../utils/cloudinary.js";

/* =====================================
   CREATE PROPERTY (Cloudinary + Multer)
===================================== */
export const createProperty = async (req, res) => {
  try {
    let images = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploaded = await uploadOnCloud(file.path);

        if (uploaded) {
          images.push({
            public_id: uploaded.public_id,
            url: uploaded.secure_url,
          });
        }
      }
    }

    const property = await Property.create({
      ...req.body,
      images,
      owner: req.user.id,
      status: "pending",
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: "Property created successfully",
      property,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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
        { city: { $regex: search, $options: "i" } },
      ];
    }

    // Price filter
    if (minPrice || maxPrice) {
      query.pricePerNight = {};
      if (minPrice) query.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) query.pricePerNight.$lte = Number(maxPrice);
    }

    // Type filter
    if (type) query.propertyType = type;

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
      .populate("owner", "name");

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
      .populate("owner", "name email");

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

    if (property.owner.toString() !== req.user.id) {
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

    if (property.owner.toString() !== req.user.id) {
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
    const properties = await Property.find({ owner: req.user.id });

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
