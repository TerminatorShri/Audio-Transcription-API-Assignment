import { Worker } from "bullmq";
import axios from "axios";
import { redisConnection } from "../config/redis.config";
import { TranscriptionJob } from "../models/transcriptionJob.model";
import envConfig from "../utils/envConfig";
import { logger } from "../utils/reqLogger";

new Worker(
  "transcription",
  async (job) => {
    const { jobId, filePath, language, task } = job.data;

    logger.info(`Scheduling Transcription Job: ${jobId}`);

    await TranscriptionJob.findByIdAndUpdate(jobId, { status: "processing" });

    try {
      const response = await axios.post(
        `${envConfig.TRANSCRIPTION_SERVICE_URL}`,
        {
          fileUrl: filePath,
          language,
          task,
        }
      );
      console.log(response.data);
      logger.info(`Transcription job ${jobId} completed successfully.`);
      await TranscriptionJob.findByIdAndUpdate(jobId, {
        status: "completed",
        transcriptionText: response.data.text,
      });
    } catch (error: any) {
      await TranscriptionJob.findByIdAndUpdate(jobId, { status: "failed" });

      const record = await TranscriptionJob.findById(jobId);
      if (record?.webhookUrl) {
        await axios.post(record.webhookUrl, {
          jobId,
          status: "failed",
          error: error.message,
        });
      }
    }
  },
  { connection: redisConnection }
);
