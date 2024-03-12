import cloudinary, { v2 as cloudinaryV2 } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinaryV2;
