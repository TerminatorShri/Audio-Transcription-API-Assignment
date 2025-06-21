import cloudinary from "../config/cloudinary.config";

export const uploadAudioToCloudinary = async (buffer: Buffer) => {
  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "audio_transcriptions",
            resource_type: "video", // Cloudinary's type for audio/video files
          },
          (error, uploadResult) => {
            if (error) {
              console.error("Error uploading audio to Cloudinary:", error);
              return reject(error);
            }
            resolve(uploadResult);
          }
        )
        .end(buffer); // stream buffer into Cloudinary
    });

    return (result as { secure_url: string }).secure_url;
  } catch (err) {
    console.error("Error uploading audio:", err);
    return null;
  }
};
