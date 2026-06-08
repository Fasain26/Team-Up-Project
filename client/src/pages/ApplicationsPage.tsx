import { Link } from "react-router-dom";
import { NavBar } from "../components/NavBar";
import { useMyApplications } from "../hooks/useEngagement";
import { CATEGORY_LABELS } from "../lib/projectMeta";

export default function ApplicationsPage() {
  const { data, isLoading, isError } = useMyApplications();

  return (
    <div className="min-h-full">
      <NavBar />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="font-display text-3xl font-bold">Your applications</h1>
        <p className="mt-1 text-ink/60">Projects you've applied to and where they stand.</p>

        {isLoading && <p className="mt-12 text-center text-ink/40">Loading…</p>}
        {isError && <p className="mt-12 text-center text-red-500">Couldn't load applications.</p>}

        {data && data.length === 0 && (
          <div className="mt-16 text-center">
            <p className="text-ink/50">You haven't applied to any projects yet.</p>
            <Link to="/projects" className="mt-2 inline-block font-semibold text-brand-700 hover:underline">
              Browse projects →
            </Link>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3">
          {data?.map((a) => (
            <div key={a.id} className="rounded-xl border border-black/10 bg-white p-4">
              <div className="flex items-center justify-between">
                <Link to={`/projects/${a.project.id}`} className="font-medium hover:text-brand-700">
                  {a.project.title}
                </Link>
                <StatusPill status={a.status} />
              </div>
              <p className="mt-1 text-xs text-ink/50">{CATEGORY_LABELS[a.project.category]}</p>
              {a.message && <p className="mt-3 text-sm text-ink/60">“{a.message}”</p>}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const tone =
    status === "ACCEPTED" ? "bg-brand-50 text-brand-700" :
    status === "REJECTED" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-700";
  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${tone}`}>{status.toLowerCase()}</span>;
}
