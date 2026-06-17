import { describe, it, expect } from "vitest";
import { registerSchema, loginSchema } from "../validators/auth.validator";

describe("registerSchema", () => {
  it("accepts a valid registration", () => {
    const result = registerSchema.safeParse({
      fullName: "Ada Lovelace",
      email: "ada@uni.edu",
      password: "Passw0rd",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a weak password (no uppercase / number)", () => {
    const result = registerSchema.safeParse({
      fullName: "Ada Lovelace",
      email: "ada@uni.edu",
      password: "password",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = registerSchema.safeParse({
      fullName: "Ada Lovelace",
      email: "not-an-email",
      password: "Passw0rd",
    });
    expect(result.success).toBe(false);
  });

  it("lowercases the email", () => {
    const result = registerSchema.parse({
      fullName: "Ada Lovelace",
      email: "ADA@UNI.EDU",
      password: "Passw0rd",
    });
    expect(result.email).toBe("ada@uni.edu");
  });
});

describe("loginSchema", () => {
  it("requires a non-empty password", () => {
    const result = loginSchema.safeParse({ email: "ada@uni.edu", password: "" });
    expect(result.success).toBe(false);
  });
});
