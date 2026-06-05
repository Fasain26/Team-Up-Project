import multer from "multer";
import { AppError } from "../utils/AppError";

/**
 * Multer parses multipart/form-data (file uploads). We use memoryStorage so the
 * file lands in req.file.buffer (RAM) and we stream it straight to Cloudinary —
 * nothing is ever written to disk (important: Render's disk is ephemeral).
 *
 * We only accept images for avatars and cap the size to stop someone uploading
 * a 2GB file to exhaust memory. This is the "secure file upload validation" the
 * spec asks for.
 */
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(AppError.badRequest("Only JPEG, PNG, WebP, or GIF images are allowed"));
    }
  },
});
