import express from "express";
import envConfig from "./utils/envConfig";
import { logger, requestLogger } from "./utils/reqLogger";

const app = express();

if (envConfig.LOGGING) {
  // app.use(loggerMiddleware);
  logger.info("Logging is Enabled");
  app.use(requestLogger);
} else {
  logger.info("Logging is Disabled");
}

export default app;
