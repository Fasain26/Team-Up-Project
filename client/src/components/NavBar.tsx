import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function NavBar() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();

  const link = (to: string, label: string) => (
    <Link
      to={to}
      className={`text-sm font-medium transition hover:text-ink ${
        pathname === to ? "text-ink" : "text-ink/50"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-10 border-b border-black/5 bg-paper/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <Link to="/dashboard" className="font-display text-xl font-bold">
            TeamUp
          </Link>
          <nav className="flex items-center gap-6">
            {link("/projects", "Browse")}
            {link("/projects/new", "New project")}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/profile" className="flex items-center gap-2">
            <span className="hidden text-sm text-ink/60 sm:inline">{user?.fullName}</span>
            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-brand-100 text-sm font-bold text-brand-600">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                user?.fullName?.charAt(0).toUpperCase()
              )}
            </div>
          </Link>
          <button onClick={() => logout()} className="text-sm text-ink/50 hover:text-ink">
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
