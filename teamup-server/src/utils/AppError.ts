/**
 * A custom error that carries an HTTP status code.
 *
 * Throughout the app, when something goes wrong in a predictable way
 * (bad input, not found, unauthorized, etc.) we `throw new AppError(...)`.
 * The central errorHandler then knows the right status code to send back.
 *
 * `isOperational` distinguishes errors we EXPECT (a 404, a 401 — safe to show
 * the user) from bugs we DON'T expect (a null reference — hide details in prod).
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Object.setPrototypeOf(this, AppError.prototype);
  }

  // Convenience factories — read nicely at call sites:
  // throw AppError.notFound("Project not found")
  static badRequest(msg: string) {
    return new AppError(msg, 400);
  }
  static unauthorized(msg = "Unauthorized") {
    return new AppError(msg, 401);
  }
  static forbidden(msg = "Forbidden") {
    return new AppError(msg, 403);
  }
  static notFound(msg = "Not found") {
    return new AppError(msg, 404);
  }
  static conflict(msg: string) {
    return new AppError(msg, 409);
  }
}
