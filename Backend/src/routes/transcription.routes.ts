import { Router, Request, Response, NextFunction } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware";
import { rateLimit } from "../middlewares/rateLimit.middleware";
import {
  createTranscriptionJob,
  checkJobStatus,
} from "../controllers/transcription.controller";
import { upload } from "../middlewares/multer.middleware";
import { logger } from "../utils/reqLogger";

const router = Router();

const uploadSingleFile = upload.single("file");

router.post(
  "/transcribe",
  isAuthenticated,
  rateLimit,
  uploadSingleFile,
  (req: Request, res: Response, next: NextFunction) => {
    logger.info("Transcribe request received", {
      method: req.method,
      url: req.originalUrl,
    });
    next();
  },
  createTranscriptionJob
);

router.get(
  "/status/:jobId",
  isAuthenticated,
  (req: Request, res: Response, next: NextFunction) => {
    logger.info("Check job status request received", {
      method: req.method,
      url: req.originalUrl,
    });
    next();
  },
  checkJobStatus
);

export default router;
