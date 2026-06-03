import { prisma } from "../config/prisma";
import { Prisma } from "@prisma/client";

/**
 * Repository layer = the ONLY place that talks to Prisma for the User model.
 *
 * Why bother? It keeps SQL/ORM details out of business logic. If you ever
 * swap Prisma for something else, or add caching, you change it HERE and the
 * service layer never notices. This separation is what interviewers mean by
 * "separation of concerns".
 */
export const userRepository = {
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  create(data: Prisma.UserCreateInput) {
    return prisma.user.create({ data });
  },

  /** Store the (hashed) refresh token so we can validate & revoke sessions. */
  setRefreshToken(userId: string, hashedToken: string | null) {
    return prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashedToken },
    });
  },
};
