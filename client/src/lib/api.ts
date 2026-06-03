import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

/**
 * One axios instance for the whole app.
 *
 * baseURL points at your backend's /api prefix.
 * withCredentials:true is REQUIRED so the browser sends/receives the
 * httpOnly refresh cookie the backend sets.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:4000/api",
  withCredentials: true,
});

/**
 * The access token lives in memory only (not localStorage) — safer against
 * XSS. AuthContext owns the real state; these helpers let the interceptors
 * read/update it without importing React.
 */
let accessToken: string | null = null;
export const setAccessToken = (token: string | null) => {
  accessToken = token;
};
export const getAccessToken = () => accessToken;

// --- Request interceptor: attach the token to every outgoing request ---
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

/**
 * --- Response interceptor: silent refresh ---
 * When a request 401s (access token expired), we try ONCE to hit /auth/refresh
 * (which uses the httpOnly cookie), store the new access token, and replay the
 * original request. If refresh also fails, we give up and let the error bubble
 * so the UI can redirect to login.
 *
 * `isRefreshing` + `queue` prevent a stampede: if 5 requests 401 at once, we
 * refresh only once and replay all 5 with the new token.
 */
let isRefreshing = false;
let queue: Array<(token: string | null) => void> = [];

const flushQueue = (token: string | null) => {
  queue.forEach((cb) => cb(token));
  queue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Only handle 401s, never retry the refresh call itself, and only retry once.
    const isAuthRoute = original?.url?.includes("/auth/login") || original?.url?.includes("/auth/refresh");
    if (error.response?.status !== 401 || original?._retry || isAuthRoute) {
      return Promise.reject(error);
    }

    original._retry = true;

    if (isRefreshing) {
      // wait for the in-flight refresh to finish, then replay
      return new Promise((resolve, reject) => {
        queue.push((token) => {
          if (!token) return reject(error);
          original.headers.Authorization = `Bearer ${token}`;
          resolve(api(original));
        });
      });
    }

    isRefreshing = true;
    try {
      const { data } = await api.post<{ accessToken: string }>("/auth/refresh");
      setAccessToken(data.accessToken);
      flushQueue(data.accessToken);
      original.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(original);
    } catch (refreshError) {
      flushQueue(null);
      setAccessToken(null);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
