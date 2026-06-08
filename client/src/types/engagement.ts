import type { Skill } from "./profile";
import type { ProjectCategory, Difficulty, ProjectStatus } from "./project";

export type ApplicationStatus = "PENDING" | "ACCEPTED" | "REJECTED";

// An application I've sent (GET /applications/me)
export interface MyApplication {
  id: string;
  message: string | null;
  status: ApplicationStatus;
  createdAt: string;
  project: { id: string; title: string; category: ProjectCategory; status: ProjectStatus };
}

// An applicant to my project (GET /projects/:id/applications)
export interface Applicant {
  id: string;
  message: string | null;
  status: ApplicationStatus;
  createdAt: string;
  user: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
    university: string | null;
    major: string | null;
    skills: Skill[];
  };
}

export interface RecommendedProject {
  id: string;
  title: string;
  category: ProjectCategory;
  difficulty: Difficulty;
  requiredSkills: Skill[];
  memberCount: number;
  maxMembers: number;
  matchScore: number;
}

export interface DashboardData {
  stats: {
    projectsJoined: number;
    applicationsSent: number;
    pendingApplications: number;
    projectsOwned: number;
  };
  recentApplications: {
    id: string;
    status: ApplicationStatus;
    project: { id: string; title: string };
    createdAt: string;
  }[];
  recommendations: RecommendedProject[];
}
