import { Link } from "react-router-dom";
import { NavBar } from "../components/NavBar";
import { useAuth } from "../contexts/AuthContext";
import { useDashboard } from "../hooks/useEngagement";
import { CATEGORY_LABELS } from "../lib/projectMeta";

export default function DashboardPage() {
  const { user } = useAuth();
  const { data, isLoading } = useDashboard();

  return (
    <div className="min-h-full">
      <NavBar />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="font-display text-3xl font-bold">
          Welcome back, {user?.fullName?.split(" ")[0]}
        </h1>
        <p className="mt-1 text-ink/60">Here's where your collaborations stand.</p>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat label="Projects joined" value={data?.stats.projectsJoined} loading={isLoading} />
          <Stat label="Applications sent" value={data?.stats.applicationsSent} loading={isLoading} />
          <Stat label="Pending" value={data?.stats.pendingApplications} loading={isLoading} />
          <Stat label="Projects owned" value={data?.stats.projectsOwned} loading={isLoading} />
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          {/* Recommendations */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold">Recommended for you</h2>
              <Link to="/projects" className="text-sm text-brand-700 hover:underline">Browse all</Link>
            </div>
            <div className="flex flex-col gap-3">
              {data?.recommendations.length === 0 && (
                <p className="text-sm text-ink/40">
                  Add skills to your profile to get matched with projects.
                </p>
              )}
              {data?.recommendations.map((r) => (
                <Link
                  key={r.id}
                  to={`/projects/${r.id}`}
                  className="flex items-center justify-between rounded-xl border border-black/10 bg-white p-4 transition hover:border-brand-300"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{r.title}</p>
                    <p className="text-xs text-ink/50">{CATEGORY_LABELS[r.category]}</p>
                  </div>
                  <MatchBadge score={r.matchScore} />
                </Link>
              ))}
            </div>
          </section>

          {/* Recent applications */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold">Your applications</h2>
              <Link to="/applications" className="text-sm text-brand-700 hover:underline">See all</Link>
            </div>
            <div className="flex flex-col gap-3">
              {data?.recentApplications.length === 0 && (
                <p className="text-sm text-ink/40">You haven't applied to anything yet.</p>
              )}
              {data?.recentApplications.map((a) => (
                <div key={a.id} className="flex items-center justify-between rounded-xl border border-black/10 bg-white p-4">
                  <Link to={`/projects/${a.project.id}`} className="truncate font-medium hover:text-brand-700">
                    {a.project.title}
                  </Link>
                  <StatusPill status={a.status} />
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value, loading }: { label: string; value?: number; loading: boolean }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <p className="font-display text-3xl font-bold">{loading ? "–" : value ?? 0}</p>
      <p className="mt-1 text-sm text-ink/50">{label}</p>
    </div>
  );
}

function MatchBadge({ score }: { score: number }) {
  const tone = score >= 67 ? "bg-brand-500 text-white" : score >= 34 ? "bg-brand-100 text-brand-700" : "bg-black/5 text-ink/50";
  return <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${tone}`}>{score}% match</span>;
}

function StatusPill({ status }: { status: string }) {
  const tone =
    status === "ACCEPTED" ? "bg-brand-50 text-brand-700" :
    status === "REJECTED" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-700";
  return <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${tone}`}>{status.toLowerCase()}</span>;
}
