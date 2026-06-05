import type { ProjectCategory, Difficulty, ProjectStatus } from "../types/project";

export const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  STARTUP: "Startup",
  HACKATHON: "Hackathon",
  COMPETITION: "Competition",
  RESEARCH: "Research",
  THESIS: "Thesis",
  OPEN_SOURCE: "Open Source",
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
};

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
};

export const STATUS_STYLES: Record<ProjectStatus, string> = {
  OPEN: "bg-brand-50 text-brand-700",
  IN_PROGRESS: "bg-amber-50 text-amber-700",
  COMPLETED: "bg-black/5 text-ink/50",
};

export const CATEGORIES = Object.keys(CATEGORY_LABELS) as ProjectCategory[];
export const DIFFICULTIES = Object.keys(DIFFICULTY_LABELS) as Difficulty[];
export const STATUSES = Object.keys(STATUS_LABELS) as ProjectStatus[];
