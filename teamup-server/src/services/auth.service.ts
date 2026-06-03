import bcrypt from "bcryptjs";
import { userRepository } from "../repositories/user.repository";
import { AppError } from "../utils/AppError";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  JwtPayload,
} from "../utils/jwt";
import { RegisterInput, LoginInput } from "../validators/auth.validator";

const SALT_ROUNDS = 12;

/**
 * A trimmed-down user object that is SAFE to send to the client.
 * Note: never includes `password` or `refreshToken`.
 */
function toPublicUser(user: {
  id: string;
  email: string;
  fullName: string;
  university: string | null;
  major: string | null;
  graduationYear: number | null;
  avatarUrl: string | null;
  role: string;
}) {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    university: user.university,
    major: user.major,
    graduationYear: user.graduationYear,
    avatarUrl: user.avatarUrl,
    role: user.role,
  };
}

async function issueTokens(payload: JwtPayload) {
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  // Store a HASH of the refresh token, never the token itself. If our DB
  // leaks, an attacker still can't use the stolen hashes as valid tokens.
  const hashed = await bcrypt.hash(refreshToken, SALT_ROUNDS);
  await userRepository.setRefreshToken(payload.userId, hashed);

  return { accessToken, refreshToken };
}

export const authService = {
  async register(input: RegisterInput) {
    const existing = await userRepository.findByEmail(input.email);
    if (existing) throw AppError.conflict("Email is already registered");

    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

    const user = await userRepository.create({
      fullName: input.fullName,
      email: input.email,
      password: passwordHash,
      university: input.university,
      major: input.major,
      graduationYear: input.graduationYear,
    });

    const tokens = await issueTokens({ userId: user.id, role: user.role });
    return { user: toPublicUser(user), ...tokens };
  },

  async login(input: LoginInput) {
    const user = await userRepository.findByEmail(input.email);
    // Same generic message whether the email or the password is wrong —
    // don't reveal which emails exist (account-enumeration defense).
    if (!user) throw AppError.unauthorized("Invalid credentials");

    const ok = await bcrypt.compare(input.password, user.password);
    if (!ok) throw AppError.unauthorized("Invalid credentials");

    const tokens = await issueTokens({ userId: user.id, role: user.role });
    return { user: toPublicUser(user), ...tokens };
  },

  /**
   * Exchange a valid refresh token for a fresh access (and refresh) token.
   * We verify the signature AND that it matches the hash stored for that user,
   * so a logged-out / rotated token is rejected even if still unexpired.
   */
  async refresh(refreshToken: string) {
    let payload: JwtPayload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw AppError.unauthorized("Invalid or expired refresh token");
    }

    const user = await userRepository.findById(payload.userId);
    if (!user || !user.refreshToken) throw AppError.unauthorized("Session expired");

    const matches = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!matches) throw AppError.unauthorized("Session expired");

    // Rotate: issue a brand-new pair and overwrite the stored hash.
    const tokens = await issueTokens({ userId: user.id, role: user.role });
    return { user: toPublicUser(user), ...tokens };
  },

  /** Invalidate the session by clearing the stored refresh-token hash. */
  async logout(userId: string) {
    await userRepository.setRefreshToken(userId, null);
  },
};
