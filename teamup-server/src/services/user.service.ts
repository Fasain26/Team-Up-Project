import { userRepository } from "../repositories/user.repository";
import { skillRepository } from "../repositories/skill.repository";
import { uploadBufferToCloudinary } from "./upload.service";
import { isCloudinaryConfigured } from "../config/cloudinary";
import { AppError } from "../utils/AppError";
import { UpdateProfileInput } from "../validators/user.validator";

/**
 * Shape a raw Prisma user (with nested skills) into a clean profile object for
 * the client. Flattens skills from [{ skill: {id,name} }] -> [{id,name}] and
 * never leaks password / refreshToken.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toProfile(user: any) {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    bio: user.bio,
    avatarUrl: user.avatarUrl,
    university: user.university,
    major: user.major,
    graduationYear: user.graduationYear,
    linkedinUrl: user.linkedinUrl,
    githubUrl: user.githubUrl,
    websiteUrl: user.websiteUrl,
    interests: user.interests ?? [],
    role: user.role,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    skills: (user.skills ?? []).map((us: any) => ({ id: us.skill.id, name: us.skill.name })),
  };
}

export const userService = {
  async getProfile(userId: string) {
    const user = await userRepository.findProfileById(userId);
    if (!user) throw AppError.notFound("User not found");
    return toProfile(user);
  },

  async updateProfile(userId: string, input: UpdateProfileInput) {
    const user = await userRepository.update(userId, input);
    return toProfile(user);
  },

  async listSkillCatalog() {
    return skillRepository.listAll();
  },

  async addSkill(userId: string, name: string) {
    const skill = await skillRepository.findOrCreateByName(name);
    await skillRepository.addToUser(userId, skill.id);
    return this.getProfile(userId);
  },

  async removeSkill(userId: string, skillId: string) {
    await skillRepository.removeFromUser(userId, skillId);
    return this.getProfile(userId);
  },

  async updateAvatar(userId: string, file: Express.Multer.File) {
    if (!isCloudinaryConfigured) {
      throw new AppError("Image uploads are not configured on the server", 503);
    }
    // Deterministic public_id per user + overwrite -> re-uploading replaces the
    // old image instead of leaving orphans in Cloudinary.
    const result = await uploadBufferToCloudinary(file.buffer, {
      folder: "teamup/avatars",
      public_id: userId,
      overwrite: true,
      transformation: [{ width: 400, height: 400, crop: "fill", gravity: "face" }],
    });
    const user = await userRepository.update(userId, { avatarUrl: result.secure_url });
    return toProfile(user);
  },
};
