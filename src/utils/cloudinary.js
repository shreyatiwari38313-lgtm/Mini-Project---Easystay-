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
    const uploadOnCloud = async (localFilePath)=>{
        try{
           if(!localFilePath) return null;
           const response = await cloudinary.uploader.upload(localFilePath,{
             resource: "auto" 
           })
           console.log("file has been successfully uploaded", response.url);
           return response;
        }catch(error){
          fs.unlinkSync(localFilePath)
          return null;
        }
    }
    //exporting 
    export {uploadOnCloud}