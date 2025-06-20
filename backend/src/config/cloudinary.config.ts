import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import envConfig from "../utils/envConfig";

cloudinary.config({
  cloud_name: envConfig.CLOUD_NAME,
  api_key: envConfig.CLOUD_API_KEY,
  api_secret: envConfig.CLOUD_API_SECRET,
});

export const storage = new CloudinaryStorage({
  cloudinary,
  params: () => ({
    folder: "audio_transcriptions",
    resource_type: "auto",
    allowed_formats: ["mp3", "wav", "ogg", "flac"],
  }),
});

export const upload = multer({ storage });
export default cloudinary;
