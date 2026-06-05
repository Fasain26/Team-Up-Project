import { v2 as cloudinary } from "cloudinary";
import { env } from "./env";

/**
 * True only if all three Cloudinary secrets are present. We check this before
 * attempting an upload so the whole app doesn't fall over when keys are missing
 * (e.g. you haven't signed up yet) — avatar upload just returns 503 instead.
 */
export const isCloudinaryConfigured = Boolean(
  env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export { cloudinary };
