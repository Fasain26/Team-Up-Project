import { Link } from "react-router-dom";
import type { ProjectCard as ProjectCardType } from "../types/project";
import { CATEGORY_LABELS, DIFFICULTY_LABELS, STATUS_LABELS, STATUS_STYLES } from "../lib/projectMeta";

export function ProjectCard({ project }: { project: ProjectCardType }) {
  return (
    <Link
      to={`/projects/${project.id}`}
      className="group flex flex-col rounded-2xl border border-black/10 bg-white p-5 transition hover:border-brand-300 hover:shadow-sm"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-brand-600">
          {CATEGORY_LABELS[project.category]}
        </span>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[project.status]}`}>
          {STATUS_LABELS[project.status]}
        </span>
      </div>

      <h3 className="mt-2 font-display text-lg font-bold leading-snug group-hover:text-brand-700">
        {project.title}
      </h3>
      <p className="mt-1 line-clamp-2 text-sm text-ink/60">{project.description}</p>

      {project.requiredSkills.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.requiredSkills.slice(0, 4).map((s) => (
            <span key={s.id} className="rounded-md bg-black/5 px-2 py-0.5 text-xs text-ink/70">
              {s.name}
            </span>
          ))}
          {project.requiredSkills.length > 4 && (
            <span className="px-1 text-xs text-ink/40">+{project.requiredSkills.length - 4}</span>
          )}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-black/5 pt-3 text-xs text-ink/50">
        <span>{DIFFICULTY_LABELS[project.difficulty]}</span>
        <span>
          {project.memberCount}/{project.maxMembers} members
          {project.isRemote && " · Remote"}
        </span>
      </div>
    </Link>
  );
}
