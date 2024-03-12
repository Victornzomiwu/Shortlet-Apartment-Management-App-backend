import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import UserRequest from "../../types/userRequest";

interface UploadResult {
  public_id: string;
  secure_url: string;
}
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (
    req: UserRequest,
    res: Response,
    file: Express.Multer.File
  ) => {
    return {
      folder: "Image_Uploads",
    };
  },
});

// const fileFilter = (
//   req: Request,
//   file: Express.Multer.File,
//   cb: multer.FileFilterCallback
// ) => {
//   if (file.mimetype === "image/jpg" || file.mimetype === "image/png") {
//     cb(null, true);
//   } else {
//     cb(null, false);
//     return cb(new Error("Only .png and .jpg format allowed!"));
//   }
// };
export const upload = multer({ storage: storage });
