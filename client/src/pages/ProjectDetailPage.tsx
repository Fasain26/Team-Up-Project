import { useParams } from "react-router-dom";
import { NavBar } from "../components/NavBar";
import { Button } from "../components/ui/Button";
import { useProject, useDeleteProject } from "../hooks/useProjects";
import { useAuth } from "../contexts/AuthContext";
import {
  CATEGORY_LABELS,
  DIFFICULTY_LABELS,
  STATUS_LABELS,
  STATUS_STYLES,
} from "../lib/projectMeta";

export default function ProjectDetailPage() {
  const { id = "" } = useParams();
  const { user } = useAuth();
  const { data: project, isLoading, isError } = useProject(id);
  const deleteProject = useDeleteProject();

  if (isLoading)
    return (
      <Shell>
        <p className="text-center text-ink/40">Loading…</p>
      </Shell>
    );
  if (isError || !project)
    return (
      <Shell>
        <p className="text-center text-red-500">Project not found.</p>
      </Shell>
    );

  const isOwner = user?.id === project.ownerId;

  return (
    <Shell>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-brand-600">
              {CATEGORY_LABELS[project.category]}
            </span>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[project.status]}`}>
              {STATUS_LABELS[project.status]}
            </span>
          </div>
          <h1 className="mt-2 font-display text-3xl font-bold">{project.title}</h1>
        </div>
        {isOwner && (
          <Button
            variant="ghost"
            onClick={() => {
              if (confirm("Delete this project? This can't be undone.")) deleteProject.mutate(project.id);
            }}
            className="text-red-500 hover:bg-red-50"
          >
            Delete
          </Button>
        )}
      </div>

      <p className="mt-6 whitespace-pre-wrap text-ink/80">{project.description}</p>

      <dl className="mt-8 grid gap-4 rounded-2xl border border-black/10 bg-white p-5 sm:grid-cols-4">
        <Stat label="Difficulty" value={DIFFICULTY_LABELS[project.difficulty]} />
        <Stat label="Duration" value={project.duration ?? "—"} />
        <Stat label="Location" value={project.isRemote ? "Remote" : "In person"} />
        <Stat label="Team" value={`${project.memberCount}/${project.maxMembers}`} />
      </dl>

      {project.requiredSkills.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 font-display text-lg font-bold">Skills needed</h2>
          <div className="flex flex-wrap gap-2">
            {project.requiredSkills.map((s) => (
              <span key={s.id} className="rounded-lg bg-black/5 px-3 py-1 text-sm text-ink/70">
                {s.name}
              </span>
            ))}
          </div>
        </section>
      )}

      <section className="mt-8">
        <h2 className="mb-3 font-display text-lg font-bold">Team</h2>
        <div className="flex flex-col gap-2">
          {project.members.map((m) => (
            <div key={m.id} className="flex items-center gap-3 rounded-xl border border-black/5 bg-white p-3">
              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-brand-100 text-sm font-bold text-brand-600">
                {m.user.avatarUrl ? (
                  <img src={m.user.avatarUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  m.user.fullName.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <p className="text-sm font-medium">{m.user.fullName}</p>
                <p className="text-xs text-ink/50">{m.role.replace(/_/g, " ")}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <p className="mt-10 text-sm text-ink/40">
        Applying to projects arrives on Day 6 — this is the read-only detail view for now.
      </p>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full">
      <NavBar />
      <main className="mx-auto max-w-3xl px-6 py-10">{children}</main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-ink/40">{label}</dt>
      <dd className="mt-0.5 font-medium text-ink/80">{value}</dd>
    </div>
  );
}
