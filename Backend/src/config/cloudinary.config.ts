import { v2 as cloudinary } from "cloudinary";
import envConfig from "../utils/envConfig";

cloudinary.config({
  cloud_name: envConfig.CLOUD_NAME,
  api_key: envConfig.CLOUD_API_KEY,
  api_secret: envConfig.CLOUD_API_SECRET,
});

export default cloudinary;
