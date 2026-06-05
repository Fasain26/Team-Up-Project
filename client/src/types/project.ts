import type { Skill } from "./profile";

export type ProjectCategory =
  | "STARTUP"
  | "HACKATHON"
  | "COMPETITION"
  | "RESEARCH"
  | "THESIS"
  | "OPEN_SOURCE";

export type Difficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
export type ProjectStatus = "OPEN" | "IN_PROGRESS" | "COMPLETED";

export interface ProjectOwner {
  id: string;
  fullName: string;
  avatarUrl: string | null;
  university: string | null;
  major?: string | null;
}

export interface ProjectMember {
  id: string;
  role: string;
  user: { id: string; fullName: string; avatarUrl: string | null };
}

export interface ProjectCard {
  id: string;
  title: string;
  description: string;
  category: ProjectCategory;
  difficulty: Difficulty;
  duration: string | null;
  status: ProjectStatus;
  isRemote: boolean;
  maxMembers: number;
  memberCount: number;
  applicationCount: number;
  owner: ProjectOwner;
  requiredSkills: Skill[];
  createdAt: string;
}

export interface ProjectDetail extends ProjectCard {
  ownerId: string;
  members: ProjectMember[];
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProjectListResponse {
  items: ProjectCard[];
  pagination: Pagination;
}

export interface ProjectFilters {
  q?: string;
  category?: ProjectCategory;
  difficulty?: Difficulty;
  status?: ProjectStatus;
  skill?: string;
  isRemote?: boolean;
  page?: number;
  limit?: number;
  sort?: "newest" | "oldest";
}

export interface CreateProjectPayload {
  title: string;
  description: string;
  category: ProjectCategory;
  difficulty: Difficulty;
  duration?: string;
  maxMembers: number;
  isRemote: boolean;
  requiredSkills: string[];
}
