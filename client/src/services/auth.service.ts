import { api } from "../lib/api";
import type { AuthResponse, LoginPayload, RegisterPayload } from "../types/auth";

/**
 * Thin wrappers around the auth endpoints. Components/contexts call THESE,
 * never axios directly — same separation-of-concerns idea as the backend's
 * service layer.
 */
export const authService = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/auth/register", payload);
    return data;
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/auth/login", payload);
    return data;
  },

  async logout(): Promise<void> {
    await api.post("/auth/logout");
  },

  // Used on app startup to see if a refresh cookie is still valid.
  async refresh(): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/auth/refresh");
    return data;
  },
};
