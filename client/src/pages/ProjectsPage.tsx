import { useState } from "react";
import { NavBar } from "../components/NavBar";
import { ProjectCard } from "../components/ProjectCard";
import { useProjects } from "../hooks/useProjects";
import { CATEGORIES, CATEGORY_LABELS } from "../lib/projectMeta";
import type { ProjectCategory, ProjectFilters } from "../types/project";

export default function ProjectsPage() {
  const [filters, setFilters] = useState<ProjectFilters>({ page: 1, limit: 9, sort: "newest" });
  const [searchInput, setSearchInput] = useState("");
  const { data, isLoading, isError } = useProjects(filters);

  // change a filter -> reset to page 1
  const setFilter = (patch: Partial<ProjectFilters>) =>
    setFilters((f) => ({ ...f, ...patch, page: 1 }));

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilter({ q: searchInput.trim() || undefined });
  };

  const pagination = data?.pagination;

  return (
    <div className="min-h-full">
      <NavBar />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="font-display text-3xl font-bold">Browse projects</h1>
        <p className="mt-1 text-ink/60">Find a team that fits your skills.</p>

        {/* Search + filters */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <form onSubmit={submitSearch} className="flex-1">
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search title or description…"
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/40"
            />
          </form>

          <select
            value={filters.category ?? ""}
            onChange={(e) =>
              setFilter({ category: (e.target.value || undefined) as ProjectCategory | undefined })
            }
            className="rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-500"
          >
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
            ))}
          </select>

          <select
            value={filters.isRemote === undefined ? "" : String(filters.isRemote)}
            onChange={(e) =>
              setFilter({ isRemote: e.target.value === "" ? undefined : e.target.value === "true" })
            }
            className="rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-500"
          >
            <option value="">Any location</option>
            <option value="true">Remote</option>
            <option value="false">In person</option>
          </select>

          <select
            value={filters.sort}
            onChange={(e) => setFilter({ sort: e.target.value as "newest" | "oldest" })}
            className="rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-500"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>

        {/* Results */}
        {isLoading && <p className="mt-12 text-center text-ink/40">Loading projects…</p>}
        {isError && <p className="mt-12 text-center text-red-500">Couldn’t load projects.</p>}

        {data && data.items.length === 0 && (
          <div className="mt-16 text-center">
            <p className="text-ink/50">No projects match your filters.</p>
          </div>
        )}

        {data && data.items.length > 0 && (
          <>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.items.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-4">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) - 1 }))}
                  className="rounded-lg border border-black/10 px-4 py-2 text-sm disabled:opacity-40"
                >
                  ← Prev
                </button>
                <span className="text-sm text-ink/60">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) + 1 }))}
                  className="rounded-lg border border-black/10 px-4 py-2 text-sm disabled:opacity-40"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
