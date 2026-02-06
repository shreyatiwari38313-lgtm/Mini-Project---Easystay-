import {v2 as cloudinary} from "cloudinary";

import fs from "fs";      // fs stands for file system

//configuration 
cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    //we have to keep them(cloud_name,api_key,api_secret) in .env file

    //uploading a file
    const uploadOnCloud = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.error("❌ [CLOUDINARY] No file path provided");
      return null;
    }

    console.log("🚀 [CLOUDINARY] Uploading file:", localFilePath);
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "easystay/properties",
    });

    console.log("✅ [CLOUDINARY] Upload successful:", response.secure_url);
    // Cleanup after success
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
      console.log("🗑️  [CLOUDINARY] Temp file deleted");
    }
    return response;
  } catch (error) {
    console.error("❌ [CLOUDINARY] Upload failed:", error.message);
    // Cleanup on error
    if (localFilePath && fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    return null;
  }
};

  //exporting 
  export {uploadOnCloud}