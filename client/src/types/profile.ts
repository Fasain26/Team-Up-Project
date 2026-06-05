export interface Skill {
  id: string;
  name: string;
}

// The richer object returned by GET /users/me (vs the slim login User).
export interface Profile {
  id: string;
  email: string;
  fullName: string;
  bio: string | null;
  avatarUrl: string | null;
  university: string | null;
  major: string | null;
  graduationYear: number | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
  websiteUrl: string | null;
  interests: string[];
  role: "STUDENT" | "ADMIN";
  skills: Skill[];
}

export interface UpdateProfilePayload {
  fullName?: string;
  bio?: string;
  university?: string;
  major?: string;
  graduationYear?: number;
  linkedinUrl?: string;
  githubUrl?: string;
  websiteUrl?: string;
  interests?: string[];
}
