// Mirrors what the backend's authService.toPublicUser() returns.
export interface User {
  id: string;
  email: string;
  fullName: string;
  university: string | null;
  major: string | null;
  graduationYear: number | null;
  avatarUrl: string | null;
  role: "STUDENT" | "ADMIN";
}

// The shape of a successful /auth/login or /auth/register response.
export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  university?: string;
  major?: string;
  graduationYear?: number;
}

export interface LoginPayload {
  email: string;
  password: string;
}
