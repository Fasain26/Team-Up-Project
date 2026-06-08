import { useState } from "react";
import { useParams } from "react-router-dom";
import { NavBar } from "../components/NavBar";
import { Button } from "../components/ui/Button";
import { useProject, useDeleteProject } from "../hooks/useProjects";
import { useApply, useDecide, useMyScore, useProjectApplicants } from "../hooks/useEngagement";
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

  if (isLoading) return <Shell><p className="text-center text-ink/40">Loading…</p></Shell>;
  if (isError || !project) return <Shell><p className="text-center text-red-500">Project not found.</p></Shell>;

  const isOwner = user?.id === project.ownerId;
  const isMember = project.members.some((m) => m.user.id === user?.id);

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
          <Button variant="ghost" onClick={() => { if (confirm("Delete this project?")) deleteProject.mutate(project.id); }} className="text-red-500 hover:bg-red-50">
            Delete
          </Button>
        )}
      </div>

      {/* Apply / status box for non-owners */}
      {!isOwner && <ApplyBox projectId={project.id} isMember={isMember} canApply={project.status === "OPEN"} />}

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
              <span key={s.id} className="rounded-lg bg-black/5 px-3 py-1 text-sm text-ink/70">{s.name}</span>
            ))}
          </div>
        </section>
      )}

      <section className="mt-8">
        <h2 className="mb-3 font-display text-lg font-bold">Team</h2>
        <div className="flex flex-col gap-2">
          {project.members.map((m) => (
            <div key={m.id} className="flex items-center gap-3 rounded-xl border border-black/5 bg-white p-3">
              <Avatar name={m.user.fullName} url={m.user.avatarUrl} />
              <div>
                <p className="text-sm font-medium">{m.user.fullName}</p>
                <p className="text-xs text-ink/50">{m.role.replace(/_/g, " ")}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Owner-only: manage applicants */}
      {isOwner && <Applicants projectId={project.id} />}
    </Shell>
  );
}

function ApplyBox({ projectId, isMember, canApply }: { projectId: string; isMember: boolean; canApply: boolean }) {
  const apply = useApply(projectId);
  const { data: score } = useMyScore(projectId);
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-brand-300 bg-brand-50/50 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-medium">
          {score !== undefined ? `You're a ${score.matchScore}% skill match` : "Skill match"}
        </p>
        <p className="text-sm text-ink/60">
          {isMember ? "You're already on this team." : canApply ? "Interested? Send the owner a note." : "This project isn't open for applications."}
        </p>
      </div>
      {!isMember && canApply && (
        apply.isSuccess ? (
          <span className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white">Applied ✓</span>
        ) : open ? (
          <div className="flex w-full max-w-sm flex-col gap-2">
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={2}
              placeholder="Why you'd be a great fit (optional)…"
              className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500" />
            <div className="flex gap-2">
              <Button loading={apply.isPending} onClick={() => apply.mutate(message || undefined)}>Send application</Button>
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            </div>
            {apply.isError && <p className="text-xs text-red-500">Couldn't apply — you may have applied already.</p>}
          </div>
        ) : (
          <Button onClick={() => setOpen(true)}>Apply to join</Button>
        )
      )}
    </div>
  );
}

function Applicants({ projectId }: { projectId: string }) {
  const { data: applicants, isLoading } = useProjectApplicants(projectId, true);
  const decide = useDecide(projectId);

  return (
    <section className="mt-10">
      <h2 className="mb-3 font-display text-lg font-bold">
        Applicants {applicants ? `(${applicants.length})` : ""}
      </h2>
      {isLoading && <p className="text-sm text-ink/40">Loading applicants…</p>}
      {applicants && applicants.length === 0 && <p className="text-sm text-ink/40">No applications yet.</p>}
      <div className="flex flex-col gap-3">
        {applicants?.map((a) => (
          <div key={a.id} className="rounded-xl border border-black/10 bg-white p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <Avatar name={a.user.fullName} url={a.user.avatarUrl} />
                <div>
                  <p className="text-sm font-medium">{a.user.fullName}</p>
                  <p className="text-xs text-ink/50">{a.user.university ?? "—"}</p>
                </div>
              </div>
              {a.status === "PENDING" ? (
                <div className="flex gap-2">
                  <button onClick={() => decide.mutate({ id: a.id, status: "ACCEPTED" })}
                    className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-700">Accept</button>
                  <button onClick={() => decide.mutate({ id: a.id, status: "REJECTED" })}
                    className="rounded-lg border border-black/10 px-3 py-1.5 text-sm hover:bg-black/5">Reject</button>
                </div>
              ) : (
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${a.status === "ACCEPTED" ? "bg-brand-50 text-brand-700" : "bg-red-50 text-red-600"}`}>
                  {a.status.toLowerCase()}
                </span>
              )}
            </div>
            {a.message && <p className="mt-3 text-sm text-ink/60">“{a.message}”</p>}
            {a.user.skills.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {a.user.skills.map((s) => (
                  <span key={s.id} className="rounded-md bg-black/5 px-2 py-0.5 text-xs text-ink/70">{s.name}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
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
function Avatar({ name, url }: { name: string; url: string | null }) {
  return (
    <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-brand-100 text-sm font-bold text-brand-600">
      {url ? <img src={url} alt="" className="h-full w-full object-cover" /> : name.charAt(0).toUpperCase()}
    </div>
  );
}
