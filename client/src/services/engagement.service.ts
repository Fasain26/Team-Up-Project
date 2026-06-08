import { api } from "../lib/api";
import type {
  Applicant,
  ApplicationStatus,
  DashboardData,
  MyApplication,
} from "../types/engagement";

export const engagementService = {
  async apply(projectId: string, message?: string) {
    const { data } = await api.post(`/projects/${projectId}/apply`, { message });
    return data;
  },

  async myApplications(): Promise<MyApplication[]> {
    const { data } = await api.get<MyApplication[]>("/applications/me");
    return data;
  },

  async projectApplicants(projectId: string): Promise<Applicant[]> {
    const { data } = await api.get<Applicant[]>(`/projects/${projectId}/applications`);
    return data;
  },

  async decide(applicationId: string, status: "ACCEPTED" | "REJECTED") {
    const { data } = await api.patch<{ status: ApplicationStatus }>(
      `/applications/${applicationId}`,
      { status }
    );
    return data;
  },

  async myScore(projectId: string): Promise<{ matchScore: number }> {
    const { data } = await api.get<{ matchScore: number }>(`/projects/${projectId}/my-score`);
    return data;
  },

  async dashboard(): Promise<DashboardData> {
    const { data } = await api.get<DashboardData>("/dashboard");
    return data;
  },
};
