import mongoose from "mongoose";
import { logger } from "../utils/reqLogger";
import envConfig from "../utils/envConfig";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${envConfig.DB_URI}/${envConfig.DB_NAME}`
    );
    logger.info(
      `Database connected successfully: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    logger.error("Database connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;