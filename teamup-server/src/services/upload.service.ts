import { UploadApiOptions, UploadApiResponse } from "cloudinary";
import { cloudinary } from "../config/cloudinary";

/**
 * Cloudinary's SDK upload() reads from a file path; upload_stream() reads from
 * a buffer. Since multer gave us a buffer (memoryStorage), we wrap the
 * callback-style upload_stream in a Promise so we can `await` it cleanly.
 */
export function uploadBufferToCloudinary(
  buffer: Buffer,
  options: UploadApiOptions
): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error || !result) return reject(error ?? new Error("Upload failed"));
      resolve(result);
    });
    stream.end(buffer);
  });
}
