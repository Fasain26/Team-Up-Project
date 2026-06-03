import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { authService } from "../services/auth.service";
import { setAccessToken } from "../lib/api";
import type { User, LoginPayload, RegisterPayload } from "../types/auth";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean; // true while we check for an existing session on load
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * On first load, try to refresh. If the user still has a valid httpOnly
   * cookie from a previous visit, this silently logs them back in — so a
   * page refresh doesn't kick them out. If it fails, they're just logged out.
   */
  useEffect(() => {
    (async () => {
      try {
        const { user, accessToken } = await authService.refresh();
        setAccessToken(accessToken);
        setUser(user);
      } catch {
        setAccessToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = async (payload: LoginPayload) => {
    const { user, accessToken } = await authService.login(payload);
    setAccessToken(accessToken);
    setUser(user);
  };

  const register = async (payload: RegisterPayload) => {
    const { user, accessToken } = await authService.register(payload);
    setAccessToken(accessToken);
    setUser(user);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook so components do `const { user } = useAuth()` cleanly.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
