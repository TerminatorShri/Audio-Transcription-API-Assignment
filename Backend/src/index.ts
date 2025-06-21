import app from "./app";
import { logger } from "./utils/reqLogger";
import connectDB from "./config/db.config";
import "./services/worker";

const PORT = process.env.PORT || 3000;

connectDB();

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
