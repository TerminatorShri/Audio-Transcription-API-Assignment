import { Request, Response } from "express";
import { TranscriptionJob } from "../models/transcriptionJob.model";
import { transcriptionQueue } from "../services/queue";
import { ApiError, ApiResponse } from "../config/api.config";
import { logger } from "../utils/reqLogger";
import { AuthenticatedRequest } from "../types/req.types";
import { uploadAudioToCloudinary } from "../utils/cloudinary.utils";

export const createTranscriptionJob = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { language, task, webhookUrl } = req.body;
  const { userId } = req as AuthenticatedRequest;

  if (!userId) {
    logger.error("User ID is missing in the request");
    res.status(400).json(new ApiError(400, "User ID is required"));
    return;
  }

  if (!language || !task) {
    const missingFields = [];
    if (!language) missingFields.push("language");
    if (!task) missingFields.push("task");

    logger.error(`Missing required fields: ${missingFields.join(", ")}`);
    res
      .status(400)
      .json(
        new ApiError(
          400,
          `Missing required fields: ${missingFields.join(", ")}`
        )
      );
    return;
  }

  try {
    // ✅ Use the uploaded file buffer directly
    const fileBuffer = req.file?.buffer;

    if (!fileBuffer) {
      logger.error("No audio file uploaded or file buffer missing");
      res.status(400).json(new ApiError(400, "Audio file is required"));
      return;
    }

    const fileUrl = await uploadAudioToCloudinary(fileBuffer);

    if (!fileUrl) {
      logger.error(`Error uploading file to Cloudinary`);
      res
        .status(500)
        .json(new ApiError(500, "Error uploading file to Cloudinary"));
      return;
    }

    const job = await TranscriptionJob.create({
      fileUrl,
      language,
      task,
      status: "pending",
      webhookUrl,
      userId,
    });

    logger.info(`Transcription job created with ID: ${job._id}`);

    await transcriptionQueue.add(
      "transcription",
      {
        jobId: job._id,
        filePath: fileUrl,
        language,
        task,
      },
      { attempts: 3, backoff: { type: "exponential", delay: 5000 } }
    );

    logger.info(`Job added to queue with ID: ${job._id}`);

    res
      .status(201)
      .json(
        new ApiResponse(
          200,
          { jobId: job._id },
          "Transcription job created successfully"
        )
      );
    return;
  } catch (error: any) {
    logger.error(`Error creating transcription job: ${error.message}`);
    res
      .status(500)
      .json(new ApiError(500, error.message || "Internal Server Error"));
    return;
  }
};

export const checkJobStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { jobId } = req.params;
    const { userId } = req as AuthenticatedRequest;

    if (!userId) {
      logger.error("User ID is missing in the request");
      res.status(400).json(new ApiError(400, "User ID is required"));
      return;
    }

    if (!jobId) {
      logger.error("Job ID is missing in the request");
      res.status(400).json(new ApiError(400, "Job ID is required"));
      return;
    }

    const job = await TranscriptionJob.findById(jobId);

    if (!job) {
      logger.error(`Job not found: ${jobId}`);
      res.status(404).json(new ApiError(404, "Job not found"));
      return;
    }

    if (job.userId.toString() !== userId) {
      logger.error(
        `Unauthorized access attempt to job: ${jobId} by user: ${userId}`
      );
      res.status(403).json(new ApiError(403, "Forbidden"));
      return;
    }

    logger.info(`Job status fetched successfully for job ID: ${jobId}`);

    res.status(200).json(
      new ApiResponse(
        200,
        {
          jobId: job._id,
          status: job.status,
          fileUrl: job.fileUrl,
          webhookUrl: job.webhookUrl,
        },
        "Job status fetched successfully"
      )
    );
    return;
  } catch (error: any) {
    logger.error(`Error checking job status: ${error.message}`);
    res
      .status(500)
      .json(new ApiError(500, error.message || "Internal Server Error"));
    return;
  }
};
