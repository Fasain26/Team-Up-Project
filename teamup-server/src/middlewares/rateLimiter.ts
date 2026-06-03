import rateLimit from "express-rate-limit";

/**
 * Brute-force protection on auth endpoints. Without this, an attacker can
 * hammer /auth/login with millions of password guesses. We cap attempts
 * per IP per window.
 *
 * `standardHeaders` sends the modern RateLimit-* response headers so clients
 * know how many requests they have left.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 attempts per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts, please try again later." },
});

/** A looser limiter you can apply globally to the whole API later. */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
