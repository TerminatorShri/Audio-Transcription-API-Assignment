import { z } from "zod";

export const getTranscriptionTextSchema = z.object({
  params: z.object({
    jobId: z.string().min(1, "Job ID is required"),
  }),
});
