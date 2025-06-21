import express from "express";
import envConfig from "./utils/envConfig";
import { logger, requestLogger } from "./utils/reqLogger";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/auth.routes";
import transcriptionRouter from "./routes/transcription.routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));
app.use(cors({ origin: envConfig.CORS_ORIGIN, credentials: true }));

if (envConfig.LOGGING) {
  // app.use(loggerMiddleware);
  logger.info("Logging is Enabled");
  app.use(requestLogger);
} else {
  logger.info("Logging is Disabled");
}

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/transcription", transcriptionRouter);

export default app;
