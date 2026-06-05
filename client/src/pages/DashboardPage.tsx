import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/Button";

/**
 * Placeholder for now — real dashboard comes on Day 6. Today it just proves
 * the protected route works and shows who's logged in.
 */
export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="flex items-center justify-between">
        <span className="font-display text-2xl font-bold">TeamUp</span>
        <div className="flex items-center gap-2">
          <Link to="/profile"><Button variant="ghost">My profile</Button></Link>
          <Button variant="ghost" onClick={() => logout()}>Log out</Button>
        </div>
      </div>

      <div className="mt-12 rounded-2xl border border-black/10 bg-white p-8">
        <p className="text-ink/50">Logged in as</p>
        <h1 className="mt-1 font-display text-3xl font-bold">{user?.fullName}</h1>
        <p className="mt-1 text-ink/60">{user?.email}</p>
        {user?.university && <p className="mt-4 text-sm text-ink/50">{user.university}</p>}
      </div>

      <p className="mt-8 text-ink/40">
        🎉 Auth works end-to-end. Your profile, projects, and matching land in the
        coming days.
      </p>
    </div>
  );
}
