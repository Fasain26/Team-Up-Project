import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

/**
 * Wraps protected routes. While we're still checking for a session (isLoading),
 * we show nothing to avoid a flash of the login page. If there's no user after
 * that, redirect to /login. Otherwise render the child route via <Outlet/>.
 */
export function ProtectedRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center text-ink/50">Loading…</div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
}
