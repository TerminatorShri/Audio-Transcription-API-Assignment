import { Queue } from "bullmq";
import { redisConnection } from "../config/redis.config";

export const transcriptionQueue = new Queue("transcription", {
  connection: redisConnection,
});
