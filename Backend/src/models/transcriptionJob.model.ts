import mongoose, { Document, Schema } from "mongoose";

export interface ITranscriptionJob extends Document {
  userId: mongoose.Types.ObjectId;
  fileUrl: string;
  status: "pending" | "in_progress" | "completed" | "failed";
  language?: string;
  webhookUrl?: string;
}

const transcriptionJobSchema: Schema = new Schema<ITranscriptionJob>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    fileUrl: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ["pending", "in_progress", "completed", "failed"],
      default: "pending",
    },
    language: { type: String, required: false },
    webhookUrl: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

export const TranscriptionJob = mongoose.model<ITranscriptionJob>(
  "TranscriptionJob",
  transcriptionJobSchema
);
